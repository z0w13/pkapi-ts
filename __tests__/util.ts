export function mockApiSystem (props: Record<string, unknown> & { id: string, uuid: string }) {
  return {
    name: null,
    description: null,
    tag: null,
    pronouns: null,
    avatar_url: null,
    banner: null,
    color: null,
    created: new Date().toISOString(),
    privacy: null,
    ...props
  }
}
