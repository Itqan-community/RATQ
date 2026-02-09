import os
import json
import re


def parse_front_matter(content):
    """
    Parse YAML front matter from markdown content.
    Returns metadata dict and cleaned content.
    """
    front_matter_regex = re.compile(r"^---\s*\n(.*?)\n---\s*\n", re.DOTALL)
    match = front_matter_regex.match(content)

    metadata = {}
    clean_content = content

    if match:
        front_matter = match.group(1)
        clean_content = content[match.end() :]

        # Simple YAML parsing for title
        for line in front_matter.split("\n"):
            if ":" in line:
                key, value = line.split(":", 1)
                metadata[key.strip()] = value.strip().strip("\"'")

    return metadata, clean_content


def extract_title_from_content(content):
    """Try to find h1 header in content"""
    match = re.search(r"^#\s+(.+)$", content, re.MULTILINE)
    if match:
        return match.group(1).strip()
    return None


def get_file_group(path):
    """Determine group based on directory"""
    if path.startswith("Apps/"):
        return "apps"
    elif path.startswith("Technologies/"):
        return "technologies"
    return "root"


def generate_index():
    root_dir = "."
    search_data = []

    # Walk through directory
    for dirpath, dirnames, filenames in os.walk(root_dir):
        # Skip excluded directories
        if ".git" in dirpath or "node_modules" in dirpath or ".github" in dirpath:
            continue

        for filename in filenames:
            if not filename.endswith(".md"):
                continue

            filepath = os.path.join(dirpath, filename)
            # relative path specifically to match how the frontend expects it (no leading ./)
            rel_path = os.path.relpath(filepath, root_dir)

            try:
                with open(filepath, "r", encoding="utf-8") as f:
                    content = f.read()

                metadata, clean_content = parse_front_matter(content)

                # Determine title: Front matter > H1 > Filename
                title = metadata.get("title")
                if not title:
                    title = extract_title_from_content(content)
                if not title:
                    title = os.path.splitext(filename)[0].replace("-AR", "")

                # Determine language
                is_ar = "-AR.md" in filename
                language = "ar" if is_ar else "en"

                # Clean content for search index (remove markdown syntax mostly done by flexsearch,
                # but we can do basic cleanup if needed, keeping it raw for now as flexsearch handles it well)

                search_data.append(
                    {
                        "path": rel_path,
                        "title": title,
                        "content": clean_content.strip(),
                        "language": language,
                        "group": get_file_group(rel_path),
                    }
                )

                print(f"Indexed: {rel_path} ({language})")

            except Exception as e:
                print(f"Error processing {rel_path}: {e}")

    # Write to search-index.json
    with open("search-index.json", "w", encoding="utf-8") as f:
        json.dump(search_data, f, ensure_ascii=False, indent=2)

    print(f"Successfully generated search-index.json with {len(search_data)} entries.")


if __name__ == "__main__":
    generate_index()
