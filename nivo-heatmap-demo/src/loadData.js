const loadData = async (dataSource) => {
  try {
    const response = await import(`./${dataSource}`);
    console.log('Data loaded:', response.default);
    return response.default;
  } catch (error) {
    console.error('Error loading data:', error);
    return [];
  }
};

export default loadData;
