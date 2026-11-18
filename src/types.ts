export interface Singer {
  id: string
  nameKey: string
  descKey: string
  image: string
  // CSS object-position for the catalog card photo
  imagePosition?: string
  // Photo on the artist page (falls back to `image`)
  heroImage?: string
  heroPosition?: string
  categoryIds: string[]
  streaming: {
    id: string,
    label: string,
    link: string
  }[]
  socials: {
    id: string,
    link: string
  }[]
  projects: {
    coverPhoto: {
      alt:string,
      src: string
    },
    video: {
      type: string,
      src: string
    } | null
  }[]
}
