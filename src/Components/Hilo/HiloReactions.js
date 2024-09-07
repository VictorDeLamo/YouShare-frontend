// src/Components/Hilo/HiloReactions.js
import { apiCall } from '../../Utils/api';

class HiloReactions {
  constructor(hiloId) {
    this.hiloId = hiloId;
  }

  async like() {
    try {
      await apiCall(`/hilos/${this.hiloId}/like`, 'POST', null, null, "985b910bbc5765e5a4f8fa46f00a9a98ad3e2fea4318e3fcc0088a42f7c25885");
    } catch (error) {
      console.error('Failed to like hilo', error);
    }
  }

  async dislike() {
    try {
      await apiCall(`/hilos/${this.hiloId}/dislike`, 'POST', null, null, "985b910bbc5765e5a4f8fa46f00a9a98ad3e2fea4318e3fcc0088a42f7c25885");
    } catch (error) {
      console.error('Failed to dislike hilo', error);
    }
  }

  async boost() {
    try {
      await apiCall(`/hilos/${this.hiloId}/boost`, 'POST', null, null, "985b910bbc5765e5a4f8fa46f00a9a98ad3e2fea4318e3fcc0088a42f7c25885");
    } catch (error) {
      console.error('Failed to boost hilo', error);
    }
  }
}

export default HiloReactions;
