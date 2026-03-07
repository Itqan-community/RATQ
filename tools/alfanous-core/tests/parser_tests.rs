use alfanous_core::parser::{parse_query, QueryNode};

#[test]
fn parse_single_term() {
    let node = parse_query("الصلاة");
    assert!(matches!(node, QueryNode::Term(t) if t == "الصلاة"));
}

#[test]
fn parse_and_with_plus() {
    let node = parse_query("الجنة + النار");
    match node {
        QueryNode::And(left, right) => {
            assert!(matches!(*left, QueryNode::Term(ref t) if t == "الجنة"));
            assert!(matches!(*right, QueryNode::Term(ref t) if t == "النار"));
        }
        other => panic!("Expected And, got {:?}", other),
    }
}

#[test]
fn parse_and_with_arabic_waw() {
    let node = parse_query("الجنة و النار");
    assert!(matches!(node, QueryNode::And(_, _)));
}

#[test]
fn parse_or_with_pipe() {
    let node = parse_query("الجنة | النار");
    assert!(matches!(node, QueryNode::Or(_, _)));
}

#[test]
fn parse_or_with_arabic_aw() {
    let node = parse_query("الجنة أو النار");
    assert!(matches!(node, QueryNode::Or(_, _)));
}

#[test]
fn parse_not_with_minus() {
    let node = parse_query("-النار");
    assert!(matches!(node, QueryNode::Not(_)));
}

#[test]
fn parse_not_with_arabic_laysa() {
    let node = parse_query("ليس النار");
    assert!(matches!(node, QueryNode::Not(_)));
}

#[test]
fn parse_phrase_query() {
    let node = parse_query("\"بسم الله الرحمن الرحيم\"");
    assert!(matches!(node, QueryNode::Phrase(ref p) if p == "بسم الله الرحمن الرحيم"));
}

#[test]
fn parse_wildcard_suffix() {
    let node = parse_query("رحم*");
    assert!(matches!(node, QueryNode::Wildcard(ref w) if w == "رحم*"));
}

#[test]
fn parse_field_query() {
    let node = parse_query("سورة:يس");
    match node {
        QueryNode::Field { field, value } => {
            assert_eq!(field, "سورة");
            assert!(matches!(*value, QueryNode::Term(ref t) if t == "يس"));
        }
        other => panic!("Expected Field, got {:?}", other),
    }
}

#[test]
fn parse_grouped_expression() {
    let node = parse_query("(الصلاة + الزكاة) | الصوم");
    assert!(matches!(node, QueryNode::Or(_, _)));
}

#[test]
fn parse_complex_three_term_and() {
    let node = parse_query("الصلاة + الزكاة + الصوم");
    // Should parse as left-associative: ((الصلاة + الزكاة) + الصوم)
    assert!(matches!(node, QueryNode::And(_, _)));
}

#[test]
fn parse_synonym_operator() {
    let node = parse_query("~كتاب");
    assert!(matches!(node, QueryNode::Synonym(ref t) if t == "كتاب"));
}

#[test]
fn parse_antonym_operator() {
    let node = parse_query("#نور");
    assert!(matches!(node, QueryNode::Antonym(ref t) if t == "نور"));
}

#[test]
fn parse_root_derivation_operator() {
    let node = parse_query(">>كتب");
    assert!(matches!(node, QueryNode::Root(ref t) if t == "كتب"));
}

#[test]
fn parse_lemma_derivation_operator() {
    let node = parse_query(">كتب");
    assert!(matches!(node, QueryNode::Lemma(ref t) if t == "كتب"));
}

#[test]
fn parse_boost_operator() {
    let node = parse_query("الله^2.5");
    match node {
        QueryNode::Boost(inner, weight) => {
            assert!(matches!(*inner, QueryNode::Term(ref t) if t == "الله"));
            assert!((weight - 2.5).abs() < f64::EPSILON);
        }
        other => panic!("Expected Boost, got {:?}", other),
    }
}

#[test]
fn parse_spell_tolerance() {
    let node = parse_query("%الصلة");
    assert!(matches!(node, QueryNode::SpellTolerant(ref t) if t == "الصلة"));
}

// --- Additional parser tests ---

#[test]
fn parse_nested_and_or() {
    // (الصلاة + الزكاة) | الصوم → Or(And(...), ...)
    let node = parse_query("(الصلاة + الزكاة) | الصوم");
    match node {
        QueryNode::Or(left, right) => {
            assert!(matches!(*left, QueryNode::And(_, _)));
            assert!(matches!(*right, QueryNode::Term(ref t) if t == "الصوم"));
        }
        other => panic!("Expected Or(And, Term), got {:?}", other),
    }
}

#[test]
fn parse_multiple_or_chain() {
    // a | b | c → Or(Or(a, b), c)
    let node = parse_query("الصلاة | الزكاة | الصوم");
    match node {
        QueryNode::Or(left, right) => {
            assert!(matches!(*left, QueryNode::Or(_, _)));
            assert!(matches!(*right, QueryNode::Term(ref t) if t == "الصوم"));
        }
        other => panic!("Expected Or(Or, Term), got {:?}", other),
    }
}

#[test]
fn parse_and_not_combined() {
    // الله + -الرحمن → And(Term, Not(Term))
    let node = parse_query("الله + -الرحمن");
    match node {
        QueryNode::And(left, right) => {
            assert!(matches!(*left, QueryNode::Term(ref t) if t == "الله"));
            assert!(matches!(*right, QueryNode::Not(_)));
        }
        other => panic!("Expected And(Term, Not), got {:?}", other),
    }
}

#[test]
fn parse_arabic_waw_laysa() {
    // وليس should parse as AND + NOT
    let node = parse_query("الله وليس الرحمن");
    match node {
        QueryNode::And(left, right) => {
            assert!(matches!(*left, QueryNode::Term(ref t) if t == "الله"));
            assert!(matches!(*right, QueryNode::Not(_)));
        }
        other => panic!("Expected And(Term, Not), got {:?}", other),
    }
}

#[test]
fn parse_or_with_arabic_aw_variant() {
    // "او" (without hamza) should also work as OR
    let node = parse_query("الجنة او النار");
    assert!(matches!(node, QueryNode::Or(_, _)));
}

#[test]
fn parse_wildcard_with_question_mark() {
    let node = parse_query("رحم?");
    assert!(matches!(node, QueryNode::Wildcard(ref w) if w == "رحم?"));
}

#[test]
fn parse_field_with_english_name() {
    let node = parse_query("sura:يس");
    match node {
        QueryNode::Field { field, value } => {
            assert_eq!(field, "sura");
            assert!(matches!(*value, QueryNode::Term(ref t) if t == "يس"));
        }
        other => panic!("Expected Field, got {:?}", other),
    }
}

#[test]
fn parse_empty_query() {
    let node = parse_query("");
    // Empty input produces an empty term
    assert!(matches!(node, QueryNode::Term(ref t) if t.is_empty()));
}

#[test]
fn parse_whitespace_only_query() {
    let node = parse_query("   ");
    assert!(matches!(node, QueryNode::Term(ref t) if t.is_empty()));
}

#[test]
fn parse_boost_integer() {
    let node = parse_query("الله^3");
    match node {
        QueryNode::Boost(inner, weight) => {
            assert!(matches!(*inner, QueryNode::Term(ref t) if t == "الله"));
            assert!((weight - 3.0).abs() < f64::EPSILON);
        }
        other => panic!("Expected Boost, got {:?}", other),
    }
}

#[test]
fn parse_nested_parentheses() {
    // ((الجنة | النار) + الله)
    let node = parse_query("((الجنة | النار) + الله)");
    assert!(matches!(node, QueryNode::And(_, _)));
}

#[test]
fn parse_phrase_with_single_word() {
    let node = parse_query("\"الصلاة\"");
    assert!(matches!(node, QueryNode::Phrase(ref p) if p == "الصلاة"));
}

#[test]
fn parse_multiple_operators_precedence() {
    // OR has lower precedence than AND: a + b | c → Or(And(a, b), c)
    let node = parse_query("الصلاة + الزكاة | الصوم");
    match node {
        QueryNode::Or(left, right) => {
            assert!(matches!(*left, QueryNode::And(_, _)), "left should be And");
            assert!(matches!(*right, QueryNode::Term(_)), "right should be Term");
        }
        other => panic!("Expected Or(And, Term), got {:?}", other),
    }
}

#[test]
fn parse_root_with_and() {
    // >>كتب + الله
    let node = parse_query(">>كتب + الله");
    match node {
        QueryNode::And(left, right) => {
            assert!(matches!(*left, QueryNode::Root(ref t) if t == "كتب"));
            assert!(matches!(*right, QueryNode::Term(ref t) if t == "الله"));
        }
        other => panic!("Expected And(Root, Term), got {:?}", other),
    }
}
