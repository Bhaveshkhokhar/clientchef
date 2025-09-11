export const getTheChefProfile = async (signal) => {
  try {
    const response = await fetch("https://serverofchefbooking.onrender.com/getchefProfile", {signal,credentials:"include",});
    const data = await response.json();
    if(!response.ok){
      
      if (response.status === 401) {
        handleuserProfile(false);
        alert(data.message);
        return;
      }
      if( response.status === 404) {
        handleuserProfile(false);
        alert(data.message);
        return ;
      }
      if (response.status === 500) {
        alert(data.message);
        return;
      }
      throw new Error("Failed to fetch chef data");
    }
    return mapServerChefsToLocalChefs(data.chef);
  } catch (err) {
    throw err;
  }
};
const mapServerChefsToLocalChefs = (chef) => {
  
    return {
      id: chef.id,
      image: chef.image,
      number:chef.number,
      name: chef.name,
      available: chef.available,
      type: chef.type,
      rating: chef.rating,
      price: chef.price,
      speciality: chef.speciality,
      bio: chef.bio,
      experience: chef.experience,
      certifications: chef.certifications,
    };
};
