# Academic plan assets

The hero uses `students-uet-cutout.png`, copied unchanged from the user-provided `Tách nền.png`. Its real alpha channel was verified. The complete visible group, heads, shoulders, hands and booklets are preserved.

The placeholder has been removed. The page does not load the admissions banner or the rejected `students-cutout.png` (that image contains an opaque checkerboard). `mua-dong-am.jpg` is copied unchanged from the user-provided `đông ấm.jpg` and is used for the semester-I winter campaign card and its detail cover; the summer campaign retains its original image.

ImageGen background-extraction was attempted twice using the original banner. Prompt: extract only the four left-hand students, preserve identities/poses/clothing/booklets, remove all banner background and text, output true transparent PNG with no simulated checkerboard. Both returned opaque RGB images, so neither is used in the hero.

Inspected source alpha bounds (inclusive coordinates):

| Asset | Canvas | Nontransparent bounds |
| --- | --- | --- |
| campus-radial-collage.png | 1080 × 1350 | 108,216–965,1109 |
| one-uet-logo.png | 1764 × 1583 | 151,61–1612,1521 |
| uet-vision-logo.png | 1764 × 1583 | 250,160–1512,1422 |
| students-uet-cutout.png | 2870 × 1092 | 0,69–1535,1091 |

Wrappers and proportional CSS sizing account for transparent padding without modifying the supplied images. The student wrapper has the alpha bounds' aspect ratio, and the image uses proportional width with `height: auto`; only transparent padding is excluded. The surrounding student stage remains unclipped. No image-processing dependency was added.
