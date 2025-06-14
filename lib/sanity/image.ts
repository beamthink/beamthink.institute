import imageUrlBuilder from "@sanity/image-url"
import { client } from "./client"
import type { SanityImageSource } from "@sanity/image-url/lib/types/types"

const builder = imageUrlBuilder(client)

export function urlForImage(source: SanityImageSource) {
  return builder.image(source)
}

// Export as default as well for compatibility
export default urlForImage
