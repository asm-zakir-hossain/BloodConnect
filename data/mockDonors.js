/* ============================================================
   MOCK DONORS DATA — data/mockDonors.js
   ============================================================
   
   📚 PURPOSE
   Since our Python FastAPI backend database is not set up yet,
   we need realistic sample donor data to test our Search page UI.
   
   📚 WHAT DATA DOES A DONOR PROFILE CONTAIN? (From PRD 7.2)
   - id: Unique identifier
   - name: Full name
   - phone: Phone number (unverified by default per updated PRD)
   - bloodGroup: A+, A-, B+, B-, AB+, AB-, O+, O-
   - division & district: Location info
   - area: Neighborhood / Upazila
   - lastDonationDate: Driving the 90-day cooldown logic
   - totalDonations: History badge count
   - isAvailable: Auto-calculated or boolean status
   - phoneVisibility: "public" or "logged_in_only"
   ============================================================ */

export const mockDonors = [
  {
    id: "d1",
    name: "Tanvir Ahmed",
    phone: "01711002233",
    bloodGroup: "O+",
    division: "Dhaka",
    district: "Dhaka",
    area: "Mirpur 10",
    lastDonationDate: "2026-02-15", // Donated ~6 months ago -> AVAILABLE
    totalDonations: 4,
    isAvailable: true,
    nextEligibleDate: null,
    phoneVisibility: "public",
  },
  {
    id: "d2",
    name: "Rahim Chowdhury",
    phone: "01812345678",
    bloodGroup: "A+",
    division: "Dhaka",
    district: "Dhaka",
    area: "Dhanmondi",
    lastDonationDate: "2026-07-10", // Donated recently (< 90 days) -> UNAVAILABLE
    totalDonations: 2,
    isAvailable: false,
    nextEligibleDate: "2026-10-08",
    phoneVisibility: "public",
  },
  {
    id: "d3",
    name: "Nusrat Jahan",
    phone: "01999887766",
    bloodGroup: "B+",
    division: "Chattogram",
    district: "Chattogram",
    area: "Agrabad",
    lastDonationDate: "2025-11-20",
    totalDonations: 6,
    isAvailable: true,
    nextEligibleDate: null,
    phoneVisibility: "logged_in_only",
  },
  {
    id: "d4",
    name: "Sabbir Hossain",
    phone: "01555443322",
    bloodGroup: "O-", // Universal donor
    division: "Dhaka",
    district: "Gazipur",
    area: "Tongi",
    lastDonationDate: "2026-01-05",
    totalDonations: 8,
    isAvailable: true,
    nextEligibleDate: null,
    phoneVisibility: "public",
  },
  {
    id: "d5",
    name: "Farhana Islam",
    phone: "01677889900",
    bloodGroup: "AB+",
    division: "Sylhet",
    district: "Sylhet",
    area: "Zindabazar",
    lastDonationDate: "2026-06-25", // Cooldown until late Sept
    totalDonations: 1,
    isAvailable: false,
    nextEligibleDate: "2026-09-23",
    phoneVisibility: "public",
  },
  {
    id: "d6",
    name: "Mahmud Hasan",
    phone: "01300112233",
    bloodGroup: "O+",
    division: "Rajshahi",
    district: "Rajshahi",
    area: "Kazla",
    lastDonationDate: "2025-08-14",
    totalDonations: 5,
    isAvailable: true,
    nextEligibleDate: null,
    phoneVisibility: "public",
  },
  {
    id: "d7",
    name: "Anika Rahman",
    phone: "01400556677",
    bloodGroup: "B-",
    division: "Dhaka",
    district: "Dhaka",
    area: "Uttara Sector 7",
    lastDonationDate: "2026-03-01",
    totalDonations: 3,
    isAvailable: true,
    nextEligibleDate: null,
    phoneVisibility: "public",
  },
  {
    id: "d8",
    name: "Kazi Arif",
    phone: "01899112244",
    bloodGroup: "A-",
    division: "Khulna",
    district: "Khulna",
    area: "Boyra",
    lastDonationDate: "2026-07-28", // Very recently donated
    totalDonations: 9,
    isAvailable: false,
    nextEligibleDate: "2026-10-26",
    phoneVisibility: "logged_in_only",
  },
];
