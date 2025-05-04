import config from '@/config/config.json'

class EventFetch {
  async getEvent(id: number): Promise<any> {
    try {
      const response = await fetch(`${config.api.rootUrl}/event/${id}`)
      return response
    } catch (e) {
      return null
    }
  }
}
export default new EventFetch()
