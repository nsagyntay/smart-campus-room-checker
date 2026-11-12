import { Room } from './types';

export const sampleRooms: Room[] = [
  {
    id: 'A101',
    name: 'Room A101',
    building: 'Engineering Block',
    capacity: 40,
    equipment: ['projector', 'whiteboard'],
    blocked: false,
    bookings: [
      { id: 'b1', title: 'CS 201 — Algorithms', start: 540, end: 600 },
      { id: 'b2', title: 'Faculty Meeting', start: 780, end: 840 },
      { id: 'b3', title: 'Study Group', start: 1020, end: 1080 },
    ],
  },
  {
    id: 'B220',
    name: 'Room B220',
    building: 'Science Wing',
    capacity: 25,
    equipment: ['projector', 'lab-bench'],
    blocked: true,
    blockedReason: 'Under renovation until further notice.',
    bookings: [
      { id: 'b4', title: 'Physics Lab', start: 600, end: 660 },
    ],
  },
  {
    id: 'C305',
    name: 'Room C305',
    building: 'Library Annex',
    capacity: 15,
    equipment: ['whiteboard'],
    blocked: false,
    bookings: [
      { id: 'b5', title: 'Seminar: AI Ethics', start: 690, end: 750 },
      { id: 'b6', title: 'Workshop', start: 900, end: 960 },
    ],
  },
  {
    id: 'D410',
    name: 'Room D410',
    building: 'Business Tower',
    capacity: 60,
    equipment: ['projector', 'video-conference', 'whiteboard'],
    blocked: false,
    bookings: [
      { id: 'b7', title: 'Guest Lecture — Marketing', start: 600, end: 660 },
      { id: 'b8', title: 'Case Study Workshop', start: 840, end: 900 },
    ],
  },
  {
    id: 'E112',
    name: 'Room E112',
    building: 'Arts Centre',
    capacity: 20,
    equipment: ['projector', 'video-conference'],
    blocked: false,
    bookings: [
      { id: 'b9', title: 'Film Screening', start: 720, end: 780 },
    ],
  },
];

export const allEquipment: string[] = [
  'projector',
  'whiteboard',
  'video-conference',
  'lab-bench',
];
