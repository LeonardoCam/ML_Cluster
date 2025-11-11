import {
  AutoProcessor,
  AutoTokenizer,
  CLIPVisionModelWithProjection,
  CLIPTextModelWithProjection,
  RawImage,
} from "@xenova/transformers";

const processorPromise = AutoProcessor.from_pretrained("Xenova/clip-vit-base-patch16");
const visionModelPromise = CLIPVisionModelWithProjection.from_pretrained("Xenova/clip-vit-base-patch16");
const tokenizerPromise = AutoTokenizer.from_pretrained("Xenova/clip-vit-base-patch16");
const textModelPromise = CLIPTextModelWithProjection.from_pretrained("Xenova/clip-vit-base-patch16");

export async function visionEmbeddingGenerator(imagePath) {
  const processor = await processorPromise;
  const visionModel = await visionModelPromise;
  const image = await RawImage.read(imagePath);
  const inputs = await processor(image);
  const { image_embeds } = await visionModel(inputs);
  return image_embeds.data;
}

export async function textEmbeddingGenerator(text) {
  const tokenizer = await tokenizerPromise;
  const textModel = await textModelPromise;
  const inputs = tokenizer([text], { padding: true, truncation: true });
  const { text_embeds } = await textModel(inputs);
  return text_embeds.data;
}
