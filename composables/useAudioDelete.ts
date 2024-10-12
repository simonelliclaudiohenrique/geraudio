export const useAudioDelete = () => {
  const loadings = ref<Record<string, boolean>>({});

  const deleteAudio = async (id: string) => {
    loadings.value[id] = true;

    try {
       const response = await $fetch<{ url: string }>(`/api/generations/${id}`, {
         method: 'DELETE'
       });
    } catch (e) {
      console.error(e);
    } finally {
      loadings.value[id] = false;
    }
  };


  return {
    loadings,
    deleteAudio
  };
};
