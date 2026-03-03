# Dependency Updates - March 2025

This document summarizes the dependency updates performed on the OpenRA website.

## Ruby/Jekyll Dependencies (Gemfile)

### Updated Packages:

1. **github-pages**: `209` → `232`
   - Core GitHub Pages gem that bundles Jekyll and plugins
   - Updated to latest stable version with security fixes

2. **jekyll-feed**: `~> 0.15.1` → `~> 0.17`
   - Atom/RSS feed generator plugin
   - Minor version update with improvements

3. **webrick**: `~> 1.7` → `~> 1.8`
   - HTTP server library (required for Ruby 3.0+)
   - Updated to latest stable version

4. **wdm**: `~> 0.1.1` → `~> 0.2.0`
   - Windows directory monitor for auto-regeneration
   - Minor version update

5. **tzinfo**: `~> 1.2` → `>= 1.2, < 3`
   - Timezone library
   - Expanded version constraint for better compatibility

### Indirect Updates:
The github-pages update brought many transitive dependency updates including:
- activesupport: `6.0.3.4` → `8.1.2`
- jekyll: `3.9.0` → `3.10.0`
- nokogiri: `1.11.1` → `1.18.2` (security updates)
- addressable: `2.7.0` → `2.8.9`
- faraday: `1.3.0` → `2.14.1`
- And many other security and stability improvements

## JavaScript Dependencies (CDN)

### Updated Packages:

1. **jQuery**: `3.5.1` → `3.7.1`
   - Core JavaScript library
   - Updated to latest stable version with bug fixes and improvements
   - Location: `_includes/foot.html`

2. **Popper.js**: `popper.js@1.16.1` → `@popperjs/core@2.11.8`
   - Tooltip positioning library
   - Updated to Popper v2 (new package namespace)
   - Location: `games.html`

### Unchanged Packages:
- **svgxuse**: `1.2.6` (still maintained, latest version)
- **lite-youtube-embed**: `0.3.4` (latest version)
- **jquery-hoverintent**: `1.10.2` (stable, no updates needed)
- **flot**: `4.2.6` (all variants - latest stable version)

## Testing

The site was successfully built after updates:
```bash
bundle exec jekyll build
```

Build completed in ~7.8 seconds with no errors.

## Compatibility Notes

- All updates maintain backward compatibility with existing code
- The Popper.js update from v1 to v2 uses the same API for this site's usage
- Ruby 3.x compatibility maintained through github-pages gem updates
- GitHub Actions deployment pipeline remains unchanged

## Next Steps

To apply these updates locally:
```bash
bundle install
bundle exec jekyll serve
```

## Security Improvements

This update addresses multiple security vulnerabilities in:
- nokogiri (CVE patches)
- activesupport (security fixes)
- addressable (security improvements)
- Various other transitive dependencies