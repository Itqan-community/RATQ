import os
import json
import re
import sys


def get_file_group(path):
    """Determine group based on directory path."""
    if path.startswith("content/apps/"):
        return "apps"
    elif path.startswith("content/technologies/"):
        return "technologies"
    elif path.startswith("content/resources/"):
        return "resources"
    elif path.startswith("docs/"):
        return "docs"
    return "root"


def is_arabic_file(path):
    """Check if a file is an Arabic version based on directory convention."""
    if path.startswith("docs/ar/"):
        return True
    if path.startswith("content/") and "/ar/" in path:
        return True
    return False


def extract_title(filepath, rel_path):
    """Extract title from front matter, H1 header, or filename."""
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read(4096)
    except Exception:
        return os.path.splitext(os.path.basename(rel_path))[0]

    # Try front matter
    fm_match = re.match(r"^---\s*\n(.*?)\n---\s*\n", content, re.DOTALL)
    if fm_match:
        for line in fm_match.group(1).split("\n"):
            if ":" in line:
                key, value = line.split(":", 1)
                if key.strip().lower() == "title":
                    return value.strip().strip("\"'")

    # Try H1 header
    h1_match = re.search(r"^#\s+(.+)$", content, re.MULTILINE)
    if h1_match:
        return h1_match.group(1).strip()

    # Fallback to filename
    return os.path.splitext(os.path.basename(rel_path))[0]


def has_arabic_counterpart(rel_path):
    """Check if an Arabic counterpart exists using the /ar/ directory convention."""
    if is_arabic_file(rel_path):
        return False

    directory = os.path.dirname(rel_path)
    filename = os.path.basename(rel_path)
    ar_path = os.path.join(directory, "ar", filename)

    return os.path.isfile(ar_path)


def generate_manifest():
    root_dir = "."
    files = []
    excluded = {".git", "node_modules", ".github", ".obsidian"}

    for dirpath, dirnames, filenames in os.walk(root_dir):
        dirnames[:] = [d for d in dirnames if d not in excluded]

        for filename in filenames:
            if not filename.endswith(".md"):
                continue

            filepath = os.path.join(dirpath, filename)
            rel_path = os.path.relpath(filepath, root_dir)

            title = extract_title(filepath, rel_path)
            group = get_file_group(rel_path)
            has_ar = has_arabic_counterpart(rel_path)

            files.append({
                "path": rel_path,
                "title": title,
                "group": group,
                "hasAR": has_ar,
            })

    files.sort(key=lambda f: f["path"])

    manifest = {"files": files}

    with open("manifest.json", "w", encoding="utf-8") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)

    print(f"Generated manifest.json with {len(files)} entries.")


if __name__ == "__main__":
    try:
        generate_manifest()
    except Exception as e:
        print(f"Fatal error generating manifest: {e}", file=sys.stderr)
        sys.exit(1)
