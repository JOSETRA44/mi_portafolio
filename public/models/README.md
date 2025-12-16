Place your 3D models here. Recommended file name for the cheetah/avatar: `cheetah.glb`.

Note: A small example `cheetah.glb` with three animation clips (Idle, Walk, Run) has been generated programmatically for local testing. It is intentionally tiny and license-free so you can test blending and the animation system. Replace it with an optimized GLB exported from your 3D tool for production.

Tips:
- Export a single root node from Blender/other tools.
- Name animation clips `Idle`, `Walk`, `Run` (or similar) to let the automatic heuristics pick them.
- Keep textures embedded or use relative paths and export as GLB for simplicity.
- Optimize with gltf-pipeline or Blender's export settings to reduce size.

When ready, adding `/public/models/cheetah.glb` (or replace this example) will let the scene load it automatically.