use std::path::PathBuf;

use clap::{Parser, Subcommand};

use alfanous_core::{db, search};

#[derive(Parser)]
#[command(
    name = "alfanous",
    about = "Alfanous Quran Semantic Search Engine",
    version
)]
struct Cli {
    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum Commands {
    /// Search the Quran using the Alfanous query language.
    Search {
        /// Search query (supports AND/OR/NOT, phrases, fields, etc.)
        #[arg(short, long)]
        query: String,

        /// Maximum number of results to return.
        #[arg(short, long, default_value = "10")]
        limit: usize,

        /// Path to the Quran text file (sura_id|aya_id|text format).
        #[arg(long, default_value = "data/quran-simple-clean.txt")]
        data: PathBuf,
    },

    /// Build a persistent SQLite database from Quran text.
    Build {
        /// Path to the Quran text file.
        #[arg(long, default_value = "data/quran-simple-clean.txt")]
        data: PathBuf,

        /// Output database file path.
        #[arg(short, long, default_value = "data/quran.db")]
        output: PathBuf,
    },
}

fn main() {
    let cli = Cli::parse();

    match cli.command {
        Commands::Search { query, limit, data } => {
            let data_str = data.to_str().unwrap_or_else(|| {
                eprintln!("Error: data path contains invalid UTF-8");
                std::process::exit(1);
            });
            let conn = match db::create_in_memory(data_str) {
                Ok(c) => c,
                Err(e) => {
                    eprintln!("Error loading Quran data: {}", e);
                    std::process::exit(1);
                }
            };

            let results = search::execute(&conn, &query, limit);

            if results.is_empty() {
                println!("\n No results found.\n");
                return;
            }

            println!("\n[Alfanous] Search: \"{}\"", query);
            println!(" Results: {}", results.len());
            println!(" {:->50}", "");

            for (i, r) in results.iter().enumerate() {
                println!(
                    "{}. سورة {} [آية {}]\n   {}\n",
                    i + 1,
                    r.sura_name,
                    r.aya_id,
                    r.text
                );
            }
        }

        Commands::Build { data, output } => {
            let data_str = data.to_str().unwrap_or_else(|| {
                eprintln!("Error: data path contains invalid UTF-8");
                std::process::exit(1);
            });
            let out_str = output.to_str().unwrap_or_else(|| {
                eprintln!("Error: output path contains invalid UTF-8");
                std::process::exit(1);
            });
            match db::create_from_file(data_str, out_str) {
                Ok(_) => println!("Database built successfully: {}", out_str),
                Err(e) => {
                    eprintln!("Error building database: {}", e);
                    std::process::exit(1);
                }
            }
        }
    }
}
