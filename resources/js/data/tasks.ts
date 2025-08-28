import { Task } from '@/types/tasks';

export const taskCategories = [
  'Venue & Catering',
  'Photography & Video',
  'Flowers & Decorations',
  'Music & Entertainment',
  'Attire & Beauty',
  'Invitations & Stationery',
  'Transportation',
  'Legal & Documentation',
  'Other'
] as const;

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Book wedding venue',
    description: 'Visit and book the final venue for the wedding ceremony and reception',
    category: 'Venue & Catering',
    priority: 'high',
    status: 'completed',
    dueDate: '2024-01-15',
    assignee: 'Sarah',
    estimatedCost: 15000,
    notes: 'Rosewood Manor confirmed for June 15th'
  },
  {
    id: '2',
    title: 'Choose wedding photographer',
    description: 'Interview photographers and select one for the wedding day',
    category: 'Photography & Video',
    priority: 'high',
    status: 'completed',
    dueDate: '2024-02-01',
    assignee: 'Mike',
    estimatedCost: 3500,
    notes: 'Perfect Moments Studio selected'
  },
  {
    id: '3',
    title: 'Send save the dates',
    description: 'Design and send save the date cards to all guests',
    category: 'Invitations & Stationery',
    priority: 'medium',
    status: 'completed',
    dueDate: '2024-02-14',
    assignee: 'Sarah',
    estimatedCost: 200
  },
  {
    id: '4',
    title: 'Order wedding cake',
    description: 'Finalize cake design and place order with bakery',
    category: 'Venue & Catering',
    priority: 'medium',
    status: 'in-progress',
    dueDate: '2024-04-01',
    assignee: 'Sarah',
    estimatedCost: 800,
    notes: 'Tasting scheduled for next week'
  },
  {
    id: '5',
    title: 'Choose wedding rings',
    description: 'Shop for and purchase wedding bands',
    category: 'Attire & Beauty',
    priority: 'high',
    status: 'in-progress',
    dueDate: '2024-04-15',
    assignee: 'Both',
    estimatedCost: 2500
  },
  {
    id: '6',
    title: 'Book honeymoon',
    description: 'Research and book honeymoon destination and accommodations',
    category: 'Transportation',
    priority: 'medium',
    status: 'todo',
    dueDate: '2024-05-01',
    assignee: 'Mike',
    estimatedCost: 5000
  },
  {
    id: '7',
    title: 'Order flowers',
    description: 'Select and order bridal bouquet, centerpieces, and ceremony flowers',
    category: 'Flowers & Decorations',
    priority: 'medium',
    status: 'todo',
    dueDate: '2024-05-15',
    assignee: 'Sarah',
    estimatedCost: 1500
  },
  {
    id: '8',
    title: 'Finalize guest list',
    description: 'Confirm final guest count and collect all RSVPs',
    category: 'Other',
    priority: 'high',
    status: 'in-progress',
    dueDate: '2024-04-30',
    assignee: 'Both',
    notes: 'Waiting on 15 more RSVPs'
  }
];

export const assignees = ['Sarah', 'Mike', 'Both'] as const;
