from scripts.generate_search_index import (
    parse_front_matter,
    extract_title_from_content,
    get_file_group,
    is_arabic_file,
)


def test_parse_front_matter_valid():
    content = """---
title: "Test Title"
arTitle: "Arabic Title"
group: "apps"
language: "en"
---

# Extra Header
Some content here."""

    metadata, clean_content = parse_front_matter(content)

    assert metadata.get("title") == "Test Title"
    assert metadata.get("arTitle") == "Arabic Title"
    assert metadata.get("group") == "apps"
    assert metadata.get("language") == "en"

    assert "# Extra Header" in clean_content
    assert "---" not in clean_content


def test_parse_front_matter_missing():
    content = """# Just a header
No front matter here."""

    metadata, clean_content = parse_front_matter(content)

    assert metadata == {}
    assert clean_content == content


def test_parse_front_matter_malformed():
    content = """---
title: Missing quotes
invalid yaml line
---
content"""

    metadata, clean_content = parse_front_matter(content)

    assert metadata.get("title") == "Missing quotes"
    assert "invalid yaml line" not in metadata
    assert clean_content.strip() == "content"


def test_extract_title_from_content():
    content = """Some intro text
# Expected Title  
More text"""
    assert extract_title_from_content(content) == "Expected Title"

    content_no_title = "Just some text"
    assert extract_title_from_content(content_no_title) is None


def test_get_file_group_fallback():
    assert get_file_group("content/apps/app1.md") == "apps"
    assert get_file_group("content/technologies/tech1.md") == "technologies"
    assert get_file_group("content/resources/res1.md") == "resources"
    assert get_file_group("docs/doc1.md") == "docs"
    assert get_file_group("unknown/path.md") == "root"


def test_is_arabic_file_fallback():
    assert is_arabic_file("docs/ar/doc1.md") is True
    assert is_arabic_file("docs/doc1.md") is False
    assert is_arabic_file("content/apps/ar/app1.md") is True
    assert is_arabic_file("content/apps/app1.md") is False
