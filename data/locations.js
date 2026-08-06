/* ============================================================
   BANGLADESH LOCATION DATA — data/locations.js
   ============================================================
   
   📚 WHAT IS THIS FILE?
   This file contains a structured dataset of Bangladesh's
   administrative divisions and their districts.
   
   📚 WHY A SEPARATE DATA FILE?
   1. SEPARATION OF CONCERNS: Data and UI logic are separate.
      The registration form just imports this data — it doesn't
      need to know where the data comes from or how it's structured.
   
   2. REUSABILITY: The search page will also need this data.
      By putting it in one file, both pages use the same source.
   
   3. MAINTAINABILITY: If districts change or we need to add areas,
      we only update this one file.
   
   📚 BANGLADESH ADMINISTRATIVE STRUCTURE
   Bangladesh has 8 Divisions, each containing multiple Districts:
   - Barishal (6 districts)
   - Chattogram (11 districts)
   - Dhaka (13 districts)
   - Khulna (10 districts)
   - Mymensingh (4 districts)
   - Rajshahi (8 districts)
   - Rangpur (8 districts)
   - Sylhet (4 districts)
   
   Total: 64 districts across 8 divisions.
   ============================================================ */

/*
  📚 DATA STRUCTURE
  
  We use a JavaScript object (dictionary/map) where:
  - Keys = division names (strings)
  - Values = arrays of district names
  
  This makes it very efficient to look up districts by division:
  locationData["Dhaka"] → ["Dhaka", "Faridpur", "Gazipur", ...]
  
  Time complexity: O(1) for lookup (instant, regardless of data size).
*/
const locationData = {
  Barishal: [
    "Barguna",
    "Barishal",
    "Bhola",
    "Jhalokati",
    "Patuakhali",
    "Pirojpur",
  ],
  Chattogram: [
    "Bandarban",
    "Brahmanbaria",
    "Chandpur",
    "Chattogram",
    "Comilla",
    "Cox's Bazar",
    "Feni",
    "Khagrachhari",
    "Lakshmipur",
    "Noakhali",
    "Rangamati",
  ],
  Dhaka: [
    "Dhaka",
    "Faridpur",
    "Gazipur",
    "Gopalganj",
    "Kishoreganj",
    "Madaripur",
    "Manikganj",
    "Munshiganj",
    "Narayanganj",
    "Narsingdi",
    "Rajbari",
    "Shariatpur",
    "Tangail",
  ],
  Khulna: [
    "Bagerhat",
    "Chuadanga",
    "Jessore",
    "Jhenaidah",
    "Khulna",
    "Kushtia",
    "Magura",
    "Meherpur",
    "Narail",
    "Satkhira",
  ],
  Mymensingh: [
    "Jamalpur",
    "Mymensingh",
    "Netrokona",
    "Sherpur",
  ],
  Rajshahi: [
    "Bogra",
    "Chapainawabganj",
    "Joypurhat",
    "Naogaon",
    "Natore",
    "Nawabganj",
    "Pabna",
    "Rajshahi",
    "Sirajganj",
  ],
  Rangpur: [
    "Dinajpur",
    "Gaibandha",
    "Kurigram",
    "Lalmonirhat",
    "Nilphamari",
    "Panchagarh",
    "Rangpur",
    "Thakurgaon",
  ],
  Sylhet: [
    "Habiganj",
    "Moulvibazar",
    "Sunamganj",
    "Sylhet",
  ],
};

/*
  📚 EXPORTED VALUES
  
  We export three things:
  
  1. divisions — A sorted array of all division names.
     Used to populate the Division dropdown.
     Object.keys() extracts all keys from an object as an array.
     .sort() alphabetizes them.
  
  2. getDistrictsByDivision(division) — A function that returns
     the districts for a given division.
     Returns an empty array if the division doesn't exist
     (the || [] part is a "fallback").
  
  3. locationData — The raw data object, in case anything needs it.
*/

export const divisions = Object.keys(locationData).sort();

export const getDistrictsByDivision = (division) => {
  return locationData[division] || [];
};

export default locationData;
