import { Api } from ".";

const fetchPendingVendors = async () => {
  const {data} = await Api.get('admin/vendor/pending');
  console.log(data.data)
  return data.data;
};

export default fetchPendingVendors