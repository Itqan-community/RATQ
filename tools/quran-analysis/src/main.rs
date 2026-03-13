use std::path::PathBuf;

use clap::{Parser, Subcommand};

use quran_analysis::analysis::{frequency, stats};
use quran_analysis::core::arabic;
use quran_analysis::data::quran::QuranText;
use quran_analysis::nlp::stopwords::StopWords;
use quran_analysis::ontology::{graph::OntologyGraph, parser as owl_parser};
use quran_analysis::qa::answering;
use quran_analysis::search::engine::SearchEngine;
use quran_analysis::search::results;

#[derive(Parser)]
#[command(
    name = "quran-analysis",
    about = "Quran semantic search and analysis tool",
    version
)]
struct Cli {
    /// Path to the data directory
    #[arg(long, default_value = "data")]
    data_dir: PathBuf,

    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum Commands {
    /// Search the Quran for a query
    Search {
        /// The search query
        query: String,
        /// Language (ar/en, default: auto-detect)
        #[arg(long, default_value = "auto")]
        lang: String,
        /// Maximum results
        #[arg(long, default_value_t = 10)]
        limit: usize,
        /// Output format (text/json)
        #[arg(long, default_value = "text")]
        format: String,
    },
    /// Answer a question about the Quran
    Answer {
        /// The question to answer
        question: String,
        /// Language (ar/en, default: auto-detect)
        #[arg(long, default_value = "auto")]
        lang: String,
        /// Maximum answers
        #[arg(long, default_value_t = 3)]
        limit: usize,
    },
    /// Analyze word frequency and morphology
    Analyze {
        /// The word to analyze
        word: String,
    },
    /// Explore the ontology concept graph
    Ontology {
        /// The concept to explore
        concept: String,
        /// Show relations
        #[arg(long)]
        relations: bool,
    },
    /// Show corpus statistics
    Stats,
}

fn main() {
    let cli = Cli::parse();
    let data_dir = &cli.data_dir;

    match cli.command {
        Commands::Search {
            query: q,
            lang,
            limit,
            format,
        } => cmd_search(data_dir, &q, &lang, limit, &format),
        Commands::Answer {
            question,
            lang,
            limit,
        } => cmd_answer(data_dir, &question, &lang, limit),
        Commands::Analyze { word } => cmd_analyze(data_dir, &word),
        Commands::Ontology { concept, relations } => {
            cmd_ontology(data_dir, &concept, relations)
        }
        Commands::Stats => cmd_stats(data_dir),
    }
}

fn detect_lang(text: &str, lang_arg: &str) -> String {
    if lang_arg != "auto" {
        return lang_arg.to_string();
    }
    if arabic::is_arabic(text) {
        "ar".to_string()
    } else {
        "en".to_string()
    }
}

fn cmd_search(data_dir: &PathBuf, q: &str, lang_arg: &str, limit: usize, format: &str) {
    let lang = detect_lang(q, lang_arg);

    let (quran, sw) = if lang == "ar" {
        let quran = load_or_exit(QuranText::from_file(
            &data_dir.join("quran-simple-clean.txt"),
        ));
        let sw = StopWords::from_file(&data_dir.join("quran-stop-words.strict.l1.ar"))
            .unwrap_or_else(|_| StopWords::from_str(""));
        (quran, sw)
    } else {
        let quran =
            load_or_exit(QuranText::from_file(&data_dir.join("en.sahih")));
        let sw = StopWords::from_file(&data_dir.join("english-stop-words.en"))
            .unwrap_or_else(|_| StopWords::from_str(""));
        (quran, sw)
    };

    // Load QAC morphology for Arabic
    let qac = if lang == "ar" {
        let qac_path = data_dir.join("quranic-corpus-morphology-0.4.txt");
        if qac_path.exists() {
            quran_analysis::data::qac::QacMorphology::from_file(&qac_path).ok()
        } else {
            None
        }
    } else {
        None
    };

    // Load ontology if available
    let ontology = load_ontology(data_dir);

    let engine = SearchEngine::from_data(quran, sw, qac, ontology, &lang);
    let scored = engine.search(q, limit);
    let formatted = results::format_results(&scored, engine.quran(), limit);

    if format == "json" {
        print_results_json(&formatted);
    } else {
        println!("Search: \"{}\" ({} results)\n", q, formatted.len());
        for (i, r) in formatted.iter().enumerate() {
            println!(
                "{}. [{}:{}] (score: {:.2})",
                i + 1,
                r.sura,
                r.aya,
                r.score
            );
            println!("   {}\n", r.text);
        }
    }
}

fn cmd_answer(data_dir: &PathBuf, question: &str, lang_arg: &str, limit: usize) {
    let lang = detect_lang(question, lang_arg);

    let quran = if lang == "ar" {
        load_or_exit(QuranText::from_file(
            &data_dir.join("quran-simple-clean.txt"),
        ))
    } else {
        load_or_exit(QuranText::from_file(&data_dir.join("en.sahih")))
    };

    let sw = if lang == "ar" {
        StopWords::from_file(&data_dir.join("quran-stop-words.strict.l1.ar"))
            .unwrap_or_else(|_| StopWords::from_str(""))
    } else {
        StopWords::from_file(&data_dir.join("english-stop-words.en"))
            .unwrap_or_else(|_| StopWords::from_str(""))
    };
    let index = if lang == "ar" {
        quran_analysis::search::index::InvertedIndex::build(&quran, &sw)
    } else {
        quran_analysis::search::index::InvertedIndex::build_english(&quran, &sw)
    };

    let qac = if lang == "ar" {
        let qac_path = data_dir.join("quranic-corpus-morphology-0.4.txt");
        if qac_path.exists() {
            quran_analysis::data::qac::QacMorphology::from_file(&qac_path).ok()
        } else {
            None
        }
    } else {
        None
    };

    let answers = answering::answer_question_with_qac(
        question,
        &index,
        &quran,
        limit,
        qac.as_ref(),
    );

    if answers.is_empty() {
        println!("No answers found for: \"{}\"", question);
        return;
    }

    println!(
        "Question: \"{}\" (type: {:?})\n",
        question, answers[0].question_type
    );
    for (i, a) in answers.iter().enumerate() {
        println!(
            "{}. [{}:{}] (score: {:.2})",
            i + 1,
            a.sura,
            a.aya,
            a.score
        );
        println!("   {}\n", a.text);
    }
}

fn cmd_analyze(data_dir: &PathBuf, word: &str) {
    let quran = load_or_exit(QuranText::from_file(
        &data_dir.join("quran-simple-clean.txt"),
    ));

    println!("Word: {}", word);
    println!("Normalized: {}", arabic::normalize_arabic(word));

    if let Some(freq) = frequency::get_word_frequency(&quran, word) {
        println!("Frequency: {} occurrences in {} verses", freq.count, freq.verse_count);
    } else {
        println!("Not found in the Quran text.");
    }

    // Try QAC morphology — search entries for the word and display root info
    let qac_path = data_dir.join("quranic-corpus-morphology-0.4.txt");
    if qac_path.exists() {
        if let Ok(qac) = quran_analysis::data::qac::QacMorphology::from_file(&qac_path) {
            let normalized = arabic::normalize_arabic(word);
            let mut found_roots: Vec<String> = Vec::new();
            for entries in qac.entries.values() {
                for entry in entries {
                    let entry_ar = arabic::normalize_arabic(&entry.form_ar);
                    if entry_ar == normalized && !entry.root.is_empty() {
                        if !found_roots.contains(&entry.root) {
                            found_roots.push(entry.root.clone());
                        }
                    }
                }
            }
            if found_roots.is_empty() {
                println!("No morphological root found in QAC.");
            } else {
                for root in &found_roots {
                    if let Some(locs) = qac.find_by_root(root) {
                        println!("Root '{}' found in {} locations", root, locs.len());
                    }
                }
            }
        }
    }
}

fn cmd_ontology(data_dir: &PathBuf, concept: &str, show_relations: bool) {
    let owl_path = data_dir.join("qa.ontology.v1.owl");
    if !owl_path.exists() {
        eprintln!("Ontology file not found: {}", owl_path.display());
        return;
    }

    let (concepts, relations) = match owl_parser::parse_owl(&owl_path) {
        Ok(r) => r,
        Err(e) => {
            eprintln!("Failed to parse ontology: {}", e);
            return;
        }
    };

    let graph = OntologyGraph::build(concepts, relations);

    // Try Arabic lookup first, then English
    let found = graph
        .find_by_arabic(concept)
        .or_else(|| graph.find_by_english(concept))
        .or_else(|| graph.get_concept(concept));

    match found {
        Some(c) => {
            println!("Concept: {} ({})", c.label_ar, c.label_en);
            println!("ID: {}", c.id);
            if c.frequency > 0 {
                println!("Frequency: {}", c.frequency);
            }
            if !c.root.is_empty() {
                println!("Root: {}", c.root);
            }
            if !c.synonyms.is_empty() {
                println!(
                    "Synonyms: {}",
                    c.synonyms.join(", ")
                );
            }

            if show_relations {
                let outgoing = graph.outgoing_relations(&c.id);
                if !outgoing.is_empty() {
                    println!("\nOutgoing relations:");
                    for rel in outgoing {
                        println!(
                            "  {} --[{}]--> {} (freq: {})",
                            c.id, rel.verb, rel.object, rel.frequency
                        );
                    }
                }

                let incoming = graph.incoming_relations(&c.id);
                if !incoming.is_empty() {
                    println!("\nIncoming relations:");
                    for rel in incoming {
                        println!(
                            "  {} --[{}]--> {} (freq: {})",
                            rel.subject, rel.verb, c.id, rel.frequency
                        );
                    }
                }
            }
        }
        None => println!("Concept '{}' not found in ontology.", concept),
    }
}

fn cmd_stats(data_dir: &PathBuf) {
    let quran = load_or_exit(QuranText::from_file(
        &data_dir.join("quran-simple-clean.txt"),
    ));

    let s = stats::corpus_stats(&quran);

    println!("Quran Corpus Statistics");
    println!("-----------------------");
    println!("Total suras:       {}", s.total_suras);
    println!("Total verses:      {}", s.total_verses);
    println!("Total words:       {}", s.total_words);
    println!("Total characters:  {}", s.total_chars);
    println!("Unique words:      {}", s.unique_words);

    // Top 10 most frequent words
    let freqs = frequency::word_frequencies(&quran);
    println!("\nTop 10 most frequent words:");
    for (i, f) in freqs.iter().take(10).enumerate() {
        println!(
            "  {}. {} — {} occurrences ({} verses)",
            i + 1,
            f.word,
            f.count,
            f.verse_count
        );
    }
}

fn load_or_exit<T>(result: Result<T, String>) -> T {
    match result {
        Ok(v) => v,
        Err(e) => {
            eprintln!("Error: {}", e);
            std::process::exit(1);
        }
    }
}

fn load_ontology(data_dir: &PathBuf) -> Option<OntologyGraph> {
    let owl_path = data_dir.join("qa.ontology.v1.owl");
    if !owl_path.exists() {
        return None;
    }
    match owl_parser::parse_owl(&owl_path) {
        Ok((concepts, relations)) => Some(OntologyGraph::build(concepts, relations)),
        Err(_) => None,
    }
}

fn print_results_json(results: &[results::SearchResult]) {
    let json_results: Vec<serde_json::Value> = results
        .iter()
        .map(|r| {
            serde_json::json!({
                "sura": r.sura,
                "aya": r.aya,
                "text": r.text,
                "score": r.score,
                "highlights": r.highlights,
            })
        })
        .collect();
    match serde_json::to_string_pretty(&json_results) {
        Ok(json) => println!("{}", json),
        Err(e) => eprintln!("Failed to serialize results to JSON: {}", e),
    }
}
