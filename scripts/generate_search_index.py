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
    """Determine group based on directory (fallback)"""
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
    """Check if a file is an Arabic version based on directory path (fallback)"""
    # docs/ar/...  or  content/<category>/ar/...
    if path.startswith("docs/ar/"):
        return True
    if path.startswith("content/") and "/ar/" in path:
        return True
    return False


def generate_assets():
    search_data = []
    manifest_files = []

    target_dirs = ["docs", "content"]

    for root_dir in target_dirs:
        for dirpath, dirnames, filenames in os.walk(root_dir):
            if "images" in dirnames:
                dirnames.remove("images")

            for filename in filenames:
                if not filename.endswith(".md"):
                    continue

                filepath = os.path.join(dirpath, filename)
                # Need to strip the leading ./ if it were there, but since we walk 'docs' it is already clean
                rel_path = filepath.replace(os.sep, "/")

                try:
                    with open(filepath, "r", encoding="utf-8") as f:
                        content = f.read()

                    metadata, clean_content = parse_front_matter(content)

                    # Determine title: Front matter > H1 > Filename
                    title = metadata.get("title")
                    if not title:
                        title = extract_title_from_content(content)
                    if not title:
                        title = os.path.splitext(filename)[0]

                    # Determine language from front matter vs directory structure
                    language = metadata.get("language")
                    if not language:
                        is_ar = is_arabic_file(rel_path)
                        language = "ar" if is_ar else "en"

                    group = metadata.get("group")
                    if not group:
                        group = get_file_group(rel_path)

                    has_ar = False
                    if language == "en":
                        # Simplistic check if an arabic version exists by looking for it
                        ar_path = ""
                        if rel_path.startswith("docs/"):
                            ar_path = rel_path.replace("docs/", "docs/ar/")
                        elif rel_path.startswith("content/"):
                            parts = rel_path.split("/")
                            if len(parts) >= 3:
                                parts.insert(2, "ar")
                                ar_path = "/".join(parts)
                        if ar_path and os.path.exists(ar_path):
                            has_ar = True
                    else:
                        has_ar = True  # Arabic files count as having an arabic version inherently for manifest purposes

                    # Search Index Entry
                    search_data.append(
                        {
                            "path": rel_path,
                            "title": title,
                            "content": clean_content.strip(),
                            "language": language,
                            "group": group,
                        }
                    )

                    # Manifest Entry
                    manifest_entry = {
                        "path": rel_path,
                        "title": title,
                        "group": group,
                        "hasAR": has_ar,
                    }
                    if metadata.get("arTitle"):
                        manifest_entry["arTitle"] = metadata.get("arTitle")

                    if language != "ar":
                        manifest_files.append(manifest_entry)

                    print(f"Processed: {rel_path} ({language})")

                except Exception as e:
                    print(f"Error processing {rel_path}: {e}")

    # Sort the lists by path before writing to ensure deterministic output
    search_data.sort(key=lambda x: x["path"])
    manifest_files.sort(key=lambda x: x["path"])

    # Write to search-index.json
    with open("search-index.json", "w", encoding="utf-8") as f:
        json.dump(search_data, f, ensure_ascii=False, indent=2)

    print(f"Successfully generated search-index.json with {len(search_data)} entries.")

    # Write to manifest.json
    manifest_data = {"files": manifest_files}
    with open("manifest.json", "w", encoding="utf-8") as f:
        json.dump(manifest_data, f, ensure_ascii=False, indent=2)
        f.write("\n")
    print(f"Successfully generated manifest.json with {len(manifest_files)} entries.")


if __name__ == "__main__":
    generate_assets()
