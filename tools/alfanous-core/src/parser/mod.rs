mod lexer;

pub use lexer::Token;
use lexer::tokenize;

/// AST node representing a parsed query.
#[derive(Debug, Clone, PartialEq)]
pub enum QueryNode {
    Term(String),
    Phrase(String),
    Wildcard(String),
    And(Box<QueryNode>, Box<QueryNode>),
    Or(Box<QueryNode>, Box<QueryNode>),
    Not(Box<QueryNode>),
    Field { field: String, value: Box<QueryNode> },
    Synonym(String),
    Antonym(String),
    Root(String),
    Lemma(String),
    Boost(Box<QueryNode>, f64),
    SpellTolerant(String),
}

/// Parse a query string into a QueryNode AST.
pub fn parse_query(input: &str) -> QueryNode {
    let tokens = tokenize(input);
    let mut parser = Parser::new(tokens);
    parser.parse_or()
}

struct Parser {
    tokens: Vec<Token>,
    pos: usize,
}

impl Parser {
    fn new(tokens: Vec<Token>) -> Self {
        Self { tokens, pos: 0 }
    }

    fn peek(&self) -> Option<&Token> {
        self.tokens.get(self.pos)
    }

    fn advance(&mut self) -> Option<Token> {
        if self.pos < self.tokens.len() {
            let token = self.tokens[self.pos].clone();
            self.pos += 1;
            Some(token)
        } else {
            None
        }
    }

    fn expect(&mut self, expected: &Token) -> bool {
        if self.peek() == Some(expected) {
            self.advance();
            true
        } else {
            false
        }
    }

    /// OR expression: and_expr (| and_expr)*
    fn parse_or(&mut self) -> QueryNode {
        let mut left = self.parse_and();

        while self.peek() == Some(&Token::Or) {
            self.advance();
            let right = self.parse_and();
            left = QueryNode::Or(Box::new(left), Box::new(right));
        }

        left
    }

    /// AND expression: unary_expr (+ unary_expr)*
    fn parse_and(&mut self) -> QueryNode {
        let mut left = self.parse_unary();

        while self.peek() == Some(&Token::And) {
            self.advance();
            let right = self.parse_unary();
            left = QueryNode::And(Box::new(left), Box::new(right));
        }

        left
    }

    /// Unary: NOT / prefix operators / primary
    fn parse_unary(&mut self) -> QueryNode {
        match self.peek() {
            Some(Token::Not) => {
                self.advance();
                let operand = self.parse_primary();
                QueryNode::Not(Box::new(operand))
            }
            Some(Token::Tilde) => {
                self.advance();
                let word = self.read_next_word();
                QueryNode::Synonym(word)
            }
            Some(Token::Hash) => {
                self.advance();
                let word = self.read_next_word();
                QueryNode::Antonym(word)
            }
            Some(Token::DoubleGreater) => {
                self.advance();
                let word = self.read_next_word();
                QueryNode::Root(word)
            }
            Some(Token::Greater) => {
                self.advance();
                let word = self.read_next_word();
                QueryNode::Lemma(word)
            }
            Some(Token::Percent) => {
                self.advance();
                let word = self.read_next_word();
                QueryNode::SpellTolerant(word)
            }
            _ => self.parse_primary(),
        }
    }

    /// Primary: word, phrase, group, field:value
    fn parse_primary(&mut self) -> QueryNode {
        match self.advance() {
            Some(Token::Phrase(p)) => QueryNode::Phrase(p),
            Some(Token::LParen) => {
                let inner = self.parse_or();
                self.expect(&Token::RParen);
                inner
            }
            Some(Token::Word(word)) => {
                // Check for field: syntax
                if self.peek() == Some(&Token::Colon) {
                    self.advance(); // consume ':'
                    let value = self.parse_primary();
                    return QueryNode::Field {
                        field: word,
                        value: Box::new(value),
                    };
                }

                // Check for boost suffix
                if let Some(Token::Boost(weight)) = self.peek().cloned() {
                    self.advance();
                    let node = self.make_term_or_wildcard(word);
                    return QueryNode::Boost(Box::new(node), weight);
                }

                self.make_term_or_wildcard(word)
            }
            _ => QueryNode::Term(String::new()),
        }
    }

    fn make_term_or_wildcard(&self, word: String) -> QueryNode {
        if word.contains('*') || word.contains('?') || word.contains('\u{061F}') {
            QueryNode::Wildcard(word)
        } else {
            QueryNode::Term(word)
        }
    }

    fn read_next_word(&mut self) -> String {
        match self.advance() {
            Some(Token::Word(w)) => w,
            _ => String::new(),
        }
    }
}
