import os
import re
import json


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

        for line in front_matter.split("\n"):
            if ":" in line:
                key, value = line.split(":", 1)
                metadata[key.strip()] = value.strip().strip("\"'")

    return metadata, clean_content


def extract_title_from_h1(content):
    """Try to find h1 header in content."""
    match = re.search(r"^#\s+(.+)$", content, re.MULTILINE)
    if match:
        return match.group(1).strip()
    return None


def get_title(filepath):
    """Extract title from a markdown file (front matter > H1 > filename)."""
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()

        metadata, clean_content = parse_front_matter(content)

        title = metadata.get("title")
        if not title:
            title = extract_title_from_h1(content)
        if not title:
            title = os.path.splitext(os.path.basename(filepath))[0]

        return title
    except Exception as e:
        print(f"  Warning: could not read {filepath}: {e}")
        return os.path.splitext(os.path.basename(filepath))[0]


def is_arabic_file(path):
    """Check if a path points to an Arabic version of a file."""
    if path.startswith("docs/ar/"):
        return True
    if path.startswith("content/") and "/ar/" in path:
        return True
    return False


def to_ar_path(en_path):
    """
    Derive the Arabic path from an English base path.
      docs/en/X.md       -> docs/ar/X.md
      content/cat/X.md   -> content/cat/ar/X.md
    """
    if en_path.startswith("docs/en/"):
        return en_path.replace("docs/en/", "docs/ar/", 1)
    last_slash = en_path.rfind("/")
    if last_slash >= 0:
        return en_path[: last_slash + 1] + "ar/" + en_path[last_slash + 1 :]
    return None


def get_group(path):
    """Determine the manifest group from a file path."""
    if path.startswith("content/apps/"):
        return "apps"
    if path.startswith("content/technologies/"):
        return "technologies"
    if path.startswith("content/resources/"):
        return "resources"
    if path.startswith("docs/"):
        return "docs"
    return "root"


def generate_manifest():
    root_dir = "."
    entries = []

    for dirpath, dirnames, filenames in os.walk(root_dir):
        # Skip excluded directories
        skip = False
        for part in dirpath.split(os.sep):
            if part in (".git", "node_modules", ".github", ".obsidian"):
                skip = True
                break
        if skip:
            continue

        for filename in filenames:
            if not filename.endswith(".md"):
                continue

            filepath = os.path.join(dirpath, filename)
            rel_path = os.path.relpath(filepath, root_dir)

            # Skip Arabic files – we only list English base files
            if is_arabic_file(rel_path):
                continue

            # Skip root-level files that aren't in docs/ or content/
            group = get_group(rel_path)
            if group == "root":
                continue

            # Build the entry
            title = get_title(filepath)

            # Check for Arabic version
            ar_path = to_ar_path(rel_path)
            has_ar = ar_path is not None and os.path.isfile(ar_path)

            entry = {
                "path": rel_path,
                "title": title,
                "group": group,
                "hasAR": has_ar,
            }

            # If Arabic version exists, try to extract its title
            if has_ar:
                ar_title = get_title(ar_path)
                if ar_title:
                    entry["arTitle"] = ar_title

            entries.append(entry)
            ar_info = f" (AR: {entry.get('arTitle', 'n/a')})" if has_ar else ""
            print(f"  {rel_path} [{group}]{ar_info}")

    # Sort entries by group order then path for stable output
    group_order = {"docs": 0, "apps": 1, "resources": 2, "technologies": 3}
    entries.sort(key=lambda e: (group_order.get(e["group"], 99), e["path"]))

    manifest = {"files": entries}

    with open("manifest.json", "w", encoding="utf-8") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)
        f.write("\n")

    print(f"\nSuccessfully generated manifest.json with {len(entries)} entries.")


if __name__ == "__main__":
    generate_manifest()
