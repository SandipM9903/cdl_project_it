export interface Tour {
  id: string;
  employeeId: string;
  purposeOfTour?: string;
  createdAt?: string;
  approvedDate?: string;
  cb_tour_request_status?: string;
  fromDate?: string;
  toDate?: string;
  noOfDays?: number;
  scheduledDepartureDatetime?: string;
  scheduledDepartureReason?: string;
  scheduledArrivalDatetime?: string;
  scheduledArrivalReason?: string;
  tourName?: string;
  designationId?: string;
  deptId?: string;
  leaveStartDate?: string;
  leaveEndDate?: string;
  leaveDays?: number;
  leaveType?: string;
}

export interface Itinerary {
  journeyDate?: string;
  fromCity?: string;
  toCity?: string;
  flightTrainNo?: string;
  travelMode?: string;
  departureDatetime?: string;
  arrivalDatetime?: string;
  travelClass?: string;
  ticketPrice?: number;
}

export interface Attachment {
  id: string;
  fileName?: string;
  fileSize?: number;
}

export interface TourItem {
  tour: Tour;
  itineraries?: Itinerary[];
  attachments?: Attachment[];
}

export interface Employee {
  id: string;
  name: string;
  tours: TourItem[];
}

export interface DetailFieldProps {
  label: string;
  value: string;
}

export interface TravelDetail {
  srNo: string;
  date: string;
  from: string;
  to: string;
  ticketNo: string;
  modeOfTravel: string;
  departureTime: string;
  arrivalTime: string;
  class: string;
  price: string;
}

export interface ApprovalHistoryRecord {
  srNo: string;
  sentBy: string;
  sentById: string;
  sentTo: string;
  sentToId: string;
  dateTime: string;
  purpose: string;
  subject: string;
  status: string;
}