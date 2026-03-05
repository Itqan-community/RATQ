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
