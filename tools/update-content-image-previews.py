from __future__ import annotations

import re
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parent.parent
PREVIEW_ROOT = ROOT / "image-previews"
PAGES = (
    "giao-diem-tinh-hoa-project.html",
    "mothers-day.html",
    "ngoc-nga-campaign.html",
    "thoi-diem-vang-campaign.html",
    "selected-works.html",
)
MIN_SOURCE_BYTES = 300 * 1024
MAX_PREVIEW_WIDTH = 1400
WEBP_QUALITY = 80
MIN_SAVING_RATIO = 0.90

IMG_PATTERN = re.compile(r"<img\b[^>]*>", re.IGNORECASE)
ATTR_PATTERN = re.compile(
    r"""(?P<name>[\w:-]+)\s*=\s*(?P<quote>["'])(?P<value>.*?)(?P=quote)""",
    re.IGNORECASE,
)


def attributes(tag: str) -> dict[str, str]:
    return {
        match.group("name").lower(): match.group("value")
        for match in ATTR_PATTERN.finditer(tag)
    }


def relative_web_path(path: Path) -> str:
    return path.relative_to(ROOT).as_posix()


def preview_path_for(source: Path) -> Path:
    relative = source.relative_to(ROOT)
    return PREVIEW_ROOT / relative.parent / f"{relative.stem}.webp"


def make_preview(source: Path, destination: Path) -> bool:
    destination.parent.mkdir(parents=True, exist_ok=True)

    if (
        destination.exists()
        and destination.stat().st_mtime_ns >= source.stat().st_mtime_ns
    ):
        try:
            with Image.open(destination) as cached_preview:
                cached_preview.verify()
            return destination.stat().st_size < source.stat().st_size * MIN_SAVING_RATIO
        except (OSError, ValueError):
            destination.unlink(missing_ok=True)

    temporary = destination.with_suffix(".tmp.webp")
    temporary.unlink(missing_ok=True)

    try:
        with Image.open(source) as image:
            image.load()
            if image.width > MAX_PREVIEW_WIDTH:
                height = max(1, round(image.height * MAX_PREVIEW_WIDTH / image.width))
                image.thumbnail((MAX_PREVIEW_WIDTH, height), Image.Resampling.LANCZOS)

            if image.mode not in ("RGB", "RGBA"):
                image = image.convert("RGBA" if "transparency" in image.info else "RGB")

            image.save(
                temporary,
                "WEBP",
                quality=WEBP_QUALITY,
                method=6,
                exact=True,
            )

        with Image.open(temporary) as preview:
            preview.verify()
    except (OSError, ValueError) as error:
        print(f"Skipped unreadable image: {relative_web_path(source)} ({error})")
        temporary.unlink(missing_ok=True)
        return False

    if temporary.stat().st_size >= source.stat().st_size * MIN_SAVING_RATIO:
        temporary.unlink(missing_ok=True)
        return False

    temporary.replace(destination)
    return True


def add_or_replace_attribute(tag: str, name: str, value: str) -> str:
    pattern = re.compile(
        rf"""(\b{re.escape(name)}\s*=\s*)(["']).*?\2""",
        re.IGNORECASE,
    )
    replacement = rf'\1"{value}"'
    if pattern.search(tag):
        return pattern.sub(replacement, tag, count=1)

    insert_at = tag.rfind("/>")
    if insert_at < 0:
        insert_at = tag.rfind(">")
    return f'{tag[:insert_at]} {name}="{value}"{tag[insert_at:]}'


def optimize_tag(tag: str) -> tuple[str, tuple[int, int] | None]:
    attrs = attributes(tag)
    if attrs.get("loading", "").lower() != "lazy":
        return tag, None

    source_value = attrs.get("data-full") or attrs.get("src")
    if not source_value or source_value.startswith(("http:", "https:", "//", "data:")):
        return tag, None

    source = ROOT / source_value.split("?", 1)[0].split("#", 1)[0]
    if (
        not source.is_file()
        or PREVIEW_ROOT in source.parents
        or source.suffix.lower() not in {".jpg", ".jpeg", ".png", ".webp"}
        or source.stat().st_size < MIN_SOURCE_BYTES
    ):
        return tag, None

    preview = preview_path_for(source)
    if not make_preview(source, preview):
        return tag, None

    updated = add_or_replace_attribute(tag, "src", relative_web_path(preview))
    updated = add_or_replace_attribute(updated, "data-full", relative_web_path(source))
    return updated, (source.stat().st_size, preview.stat().st_size)


def update_page(page_name: str) -> tuple[int, int, int]:
    page = ROOT / page_name
    original = page.read_text(encoding="utf-8")
    source_bytes = 0
    preview_bytes = 0
    count = 0

    def replace(match: re.Match[str]) -> str:
        nonlocal source_bytes, preview_bytes, count
        updated, sizes = optimize_tag(match.group(0))
        if sizes:
            count += 1
            source_bytes += sizes[0]
            preview_bytes += sizes[1]
        return updated

    updated = IMG_PATTERN.sub(replace, original)
    if updated != original:
        page.write_text(updated, encoding="utf-8", newline="")

    return count, source_bytes, preview_bytes


def main() -> None:
    total_count = 0
    total_source = 0
    total_preview = 0

    for page_name in PAGES:
        count, source_bytes, preview_bytes = update_page(page_name)
        total_count += count
        total_source += source_bytes
        total_preview += preview_bytes
        print(
            f"{page_name}: {count} previews, "
            f"{source_bytes / 1024 / 1024:.2f} MB -> "
            f"{preview_bytes / 1024 / 1024:.2f} MB"
        )

    saving = total_source - total_preview
    print()
    print(
        f"Total: {total_count} previews, "
        f"{total_source / 1024 / 1024:.2f} MB -> "
        f"{total_preview / 1024 / 1024:.2f} MB "
        f"(saved {saving / 1024 / 1024:.2f} MB)"
    )


if __name__ == "__main__":
    main()
