import postgres from 'postgres'

export const db = postgres({
  ssl: require,
})
