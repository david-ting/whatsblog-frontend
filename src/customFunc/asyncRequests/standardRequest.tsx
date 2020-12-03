const standardRequest = async (
  path: RequestInfo,
  options: RequestInit | undefined
) => {
  try {
    const res = await fetch(path, options);

    const status = res.status;
    const data = await res.json();

    return {
      status: status,
      data: data,
    };
  } catch (err) {
    throw err;
  }
};

export default standardRequest;
