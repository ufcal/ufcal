import config from '@/config/config.json'

class EventFetch {
  async getEvent(id: number): Promise<Response> {
    const response = await fetch(`${config.api.rootUrl}/event/${id}`)
    return response
  }
}
export default new EventFetch()
