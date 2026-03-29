/// Token produced by the query lexer.
#[derive(Debug, Clone, PartialEq)]
pub enum Token {
    Word(String),
    Phrase(String),
    And,
    Or,
    Not,
    LParen,
    RParen,
    Colon,
    Tilde,
    Hash,
    DoubleGreater,
    Greater,
    Percent,
    Boost(f64),
}

/// Tokenize a query string into a sequence of tokens.
pub fn tokenize(input: &str) -> Vec<Token> {
    let mut tokens = Vec::new();
    let mut chars = input.chars().peekable();

    while let Some(&ch) = chars.peek() {
        match ch {
            ' ' | '\t' | '\n' | '\r' => {
                chars.next();
            }
            '+' => {
                chars.next();
                tokens.push(Token::And);
            }
            '|' => {
                chars.next();
                tokens.push(Token::Or);
            }
            '(' => {
                chars.next();
                tokens.push(Token::LParen);
            }
            ')' => {
                chars.next();
                tokens.push(Token::RParen);
            }
            ':' => {
                chars.next();
                tokens.push(Token::Colon);
            }
            '~' => {
                chars.next();
                tokens.push(Token::Tilde);
            }
            '#' => {
                chars.next();
                tokens.push(Token::Hash);
            }
            '%' => {
                chars.next();
                tokens.push(Token::Percent);
            }
            '>' => {
                chars.next();
                if chars.peek() == Some(&'>') {
                    chars.next();
                    tokens.push(Token::DoubleGreater);
                } else {
                    tokens.push(Token::Greater);
                }
            }
            '-' => {
                chars.next();
                tokens.push(Token::Not);
            }
            '"' => {
                chars.next(); // skip opening quote
                let mut phrase = String::new();
                while let Some(&c) = chars.peek() {
                    if c == '"' {
                        chars.next(); // skip closing quote
                        break;
                    }
                    phrase.push(c);
                    chars.next();
                }
                tokens.push(Token::Phrase(phrase));
            }
            _ => {
                let word = read_word(&mut chars);
                // Check for Arabic operators
                match word.as_str() {
                    "و" => tokens.push(Token::And),
                    "أو" | "او" => tokens.push(Token::Or),
                    "ليس" => tokens.push(Token::Not),
                    "وليس" => {
                        tokens.push(Token::And);
                        tokens.push(Token::Not);
                    }
                    _ => {
                        // Check for boost suffix: word^N
                        if let Some(caret_pos) = word.find('^') {
                            let term = &word[..caret_pos];
                            let boost_str = &word[caret_pos + 1..];
                            if let Ok(boost_val) = boost_str.parse::<f64>() {
                                tokens.push(Token::Word(term.to_string()));
                                tokens.push(Token::Boost(boost_val));
                            } else {
                                tokens.push(Token::Word(word));
                            }
                        } else {
                            tokens.push(Token::Word(word));
                        }
                    }
                }
            }
        }
    }

    tokens
}

fn read_word(chars: &mut std::iter::Peekable<std::str::Chars>) -> String {
    let mut word = String::new();
    while let Some(&c) = chars.peek() {
        if c.is_whitespace()
            || matches!(c, '+' | '|' | '(' | ')' | ':' | '~' | '#' | '%' | '"')
        {
            break;
        }
        // Allow > inside words only if not at start (handled separately)
        if c == '>' && word.is_empty() {
            break;
        }
        if c == '-' && !word.is_empty() {
            // Hyphens inside words are kept
            word.push(c);
            chars.next();
            continue;
        }
        if c == '-' && word.is_empty() {
            break;
        }
        word.push(c);
        chars.next();
    }
    word
}
