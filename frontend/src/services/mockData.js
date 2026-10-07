export const MOCK_EVENTS = [
  {
    id: 1,
    title: "Global Tech Summit 2026",
    description: "Join leading minds in AI, Cloud Computing, and Software Architecture for a 3-day immersive tech conference.",
    venue: "Grand Convention Center, San Francisco",
    startDate: "2026-09-15T09:00:00",
    endDate: "2026-09-17T18:00:00",
    category: "Tech",
    status: "PUBLISHED",
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=80",
    totalCapacity: 1000,
    availableTickets: 420,
    creatorId: 2,
    creatorName: "Sarah Jenkins",
    creatorEmail: "creator@eventbooking.com",
    ticketTypes: [
      { ticketTypeId: 101, name: "General Admission", description: "Standard conference pass", price: 150.00, availableQuantity: 300 },
      { ticketTypeId: 102, name: "VIP All-Access", description: "VIP seating + exclusive networking dinner", price: 450.00, availableQuantity: 120 }
    ]
  },
  {
    id: 2,
    title: "Neon Nights Music Festival",
    description: "An unforgettable night featuring top electronic and synthwave artists with stunning laser visuals.",
    venue: "Sunset Amphitheater, Los Angeles",
    startDate: "2026-10-02T18:00:00",
    endDate: "2026-10-03T02:00:00",
    category: "Music",
    status: "PUBLISHED",
    imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1000&q=80",
    totalCapacity: 2500,
    availableTickets: 890,
    creatorId: 2,
    creatorName: "Sarah Jenkins",
    creatorEmail: "creator@eventbooking.com",
    ticketTypes: [
      { ticketTypeId: 103, name: "Early Bird", description: "Discounted festival ticket", price: 65.00, availableQuantity: 400 },
      { ticketTypeId: 104, name: "Main Stage Pass", description: "Front stage access", price: 120.00, availableQuantity: 490 }
    ]
  },
  {
    id: 3,
    title: "Startup Founders & Investor Pitch Night",
    description: "Connect with angel investors and venture capitalists. Pitch your startup and network with founders.",
    venue: "Innovation Hub, New York",
    startDate: "2026-10-20T17:30:00",
    endDate: "2026-10-20T21:30:00",
    category: "Business",
    status: "PENDING_APPROVAL",
    imageUrl: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1000&q=80",
    totalCapacity: 300,
    availableTickets: 300,
    creatorId: 2,
    creatorName: "Sarah Jenkins",
    creatorEmail: "creator@eventbooking.com",
    ticketTypes: [
      { ticketTypeId: 105, name: "Founder Ticket", description: "Entry + Pitch slot", price: 50.00, availableQuantity: 150 },
      { ticketTypeId: 106, name: "Attendee", description: "General networking pass", price: 25.00, availableQuantity: 150 }
    ]
  }
];

export const MOCK_TICKETS = [
  {
    id: 1,
    purchaseCode: "TKT-8F39A1B2",
    eventId: 1,
    eventTitle: "Global Tech Summit 2026",
    ticketTypeId: 102,
    ticketTypeName: "VIP All-Access",
    quantity: 2,
    totalAmount: 900.00,
    qrCodeData: "TKT-8F39A1B2",
    status: "COMPLETED",
    purchaseDate: "2026-08-15T14:30:00"
  }
];

export const MOCK_USERS = [
  { id: 1, email: "admin@eventbooking.com", firstName: "Brian", lastName: "Kimathi", phone: "+254712345678", isEmailVerified: true, isActive: true, isSuspended: false, creatorVerificationStatus: "VERIFIED", roles: ["USER", "CREATOR", "ADMIN"] },
  { id: 2, email: "creator@eventbooking.com", firstName: "Sarah", lastName: "Jenkins", phone: "+1555987654", isEmailVerified: true, isActive: true, isSuspended: false, creatorVerificationStatus: "VERIFIED", roles: ["USER", "CREATOR"] },
  { id: 3, email: "john.doe@example.com", firstName: "John", lastName: "Doe", phone: "+1555123456", isEmailVerified: false, isActive: true, isSuspended: false, creatorVerificationStatus: "PENDING", roles: ["USER"] },
  { id: 4, email: "spammer@baduser.com", firstName: "Bad", lastName: "Actor", phone: "+1555000000", isEmailVerified: false, isActive: false, isSuspended: true, creatorVerificationStatus: "NOT_REQUESTED", roles: ["USER"] }
];

export const MOCK_METRICS = {
  totalUsers: 1420,
  totalCreators: 85,
  totalEvents: 312,
  pendingApprovalEvents: 14,
  totalTicketsSold: 8940,
  totalRevenue: 645800.00,
  totalPlatformCommission: 64580.00
};
