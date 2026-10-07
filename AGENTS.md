<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep Baby Choice inside a mobile-width frame with Home, All Categories, Baby Clothing and Baby Shampoo search demo screens; unrelated actions remain inactive.
- Use individually cropped CDN asset pointers for reference imagery, never render the uploaded full-screen screenshot as the page.
- Use container-relative dimensions for this fixed-format reference layout so the original proportions remain consistent at every mobile width.
- Share catalog header, breadcrumbs and bottom navigation across the two catalog screens; use leaf index routing for All Categories so the clothing screen does not nest inside its content.
- Store reference catalog items in a browser-safe static data module; no persistence or backend is needed for the requested demo.
- Keep search filters as temporary UI state inside the search screen; the demo does not need persistence or backend filtering.
