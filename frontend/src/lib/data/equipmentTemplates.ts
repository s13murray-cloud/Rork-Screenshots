import type { EquipmentType, MasterChecklistItem, MasterChecklistTemplate, ResponseType } from '../types/equipment';

export const EQUIPMENT_CATEGORIES = [
    'Lifting / Materials Handling',
    'Earthmoving',
    'Elevated Work Platforms',
    'Vehicles',
    'Grounds Equipment'
];

export const EQUIPMENT_TYPES: EquipmentType[] = [
    // Lifting / Materials Handling
    { id: 'et_forklift', category: 'Lifting / Materials Handling', name: 'Forklift' },
    { id: 'et_telehandler', category: 'Lifting / Materials Handling', name: 'Telehandler' },
    { id: 'et_frontendloader', category: 'Lifting / Materials Handling', name: 'Front End Loader' },

    // Earthmoving
    { id: 'et_excavator', category: 'Earthmoving', name: 'Excavator' },
    { id: 'et_skidsteer', category: 'Earthmoving', name: 'Skid Steer' },

    // Elevated Work Platforms
    { id: 'et_scissorlift', category: 'Elevated Work Platforms', name: 'Scissor Lift' },
    { id: 'et_boomlift', category: 'Elevated Work Platforms', name: 'Boom Lift' },

    // Vehicles
    { id: 'et_lightvehicle', category: 'Vehicles', name: 'Light Vehicle' },
    { id: 'et_ute', category: 'Vehicles', name: 'Ute / Utility Vehicle' },
    { id: 'et_tiptruck', category: 'Vehicles', name: 'Tip Truck' },

    // Grounds Equipment
    { id: 'et_woodchipper', category: 'Grounds Equipment', name: 'Wood Chipper' }
];

// Helper to generate standard items
const createItem = (
    templateId: string,
    sort_order: number,
    section_name: string,
    item_text: string,
    is_critical = false,
    photo_required = false
): MasterChecklistItem => ({
    id: `mci_${templateId}_${sort_order}`,
    templateId,
    section_name,
    item_text,
    response_type: 'OK_FAULT_NA' as ResponseType,
    is_critical,
    photo_required,
    sort_order
});

const generateItems = (templateId: string, rawItems: { section: string, text: string, crit?: boolean, photo?: boolean }[]) => {
    return rawItems.map((item, index) => createItem(templateId, index + 1, item.section, item.text, item.crit, item.photo));
};

export const MASTER_TEMPLATES: MasterChecklistTemplate[] = [
    {
        id: 'mt_forklift',
        equipmentTypeId: 'et_forklift',
        name: 'Forklift Template',
        description: 'Standard inspection for Forklifts.',
        items: generateItems('mt_forklift', [
            { section: 'External Walkaround', text: 'Check for fluid leaks (oil, coolant, fuel, hydraulic)', crit: true, photo: true },
            { section: 'External Walkaround', text: 'Inspect tires for damage, wear, and correct pressure', crit: true },
            { section: 'External Walkaround', text: 'Check structure, bodywork, and overhead guard for damage' },
            { section: 'Lifting Mechanism', text: 'Inspect tynes/forks for wear, cracks, or distortion', crit: true, photo: true },
            { section: 'Lifting Mechanism', text: 'Check mast, carriage, and lift chains for damage, tension, and lubrication', crit: true },
            { section: 'Lifting Mechanism', text: 'Hydraulic cylinders, hoses, and fittings are free of leaks and damage', crit: true },
            { section: 'Cabin / Operator Area', text: 'Seat, seatbelt, and mirrors are in good condition and adjusted', crit: true },
            { section: 'Cabin / Operator Area', text: 'Controls, gauges, and warning lights function correctly' },
            { section: 'Operation', text: 'Horn, reversing alarm, and flashing light operational', crit: true },
            { section: 'Operation', text: 'Test brakes (foot and parking) ensure holding capacity', crit: true },
            { section: 'Operation', text: 'Test steering functions effectively without excessive play', crit: true },
            { section: 'Operation', text: 'Test hydraulic functions (lift, tilt, side-shift) smoothly', crit: true }
        ])
    },
    {
        id: 'mt_telehandler',
        equipmentTypeId: 'et_telehandler',
        name: 'Telehandler Template',
        description: 'Standard inspection for Telehandlers.',
        items: generateItems('mt_telehandler', [
            { section: 'External Walkaround', text: 'Check for fluid leaks (oil, coolant, fuel, hydraulic)', crit: true, photo: true },
            { section: 'External Walkaround', text: 'Inspect tires for damage, wear, and correct pressure', crit: true },
            { section: 'External Walkaround', text: 'Check outriggers/stabilizers for damage and operation' },
            { section: 'Lifting Mechanism', text: 'Inspect boom, wear pads, and attach points for cracks/damage', crit: true, photo: true },
            { section: 'Lifting Mechanism', text: 'Check attachment mechanism and locking pins secure', crit: true },
            { section: 'Cabin / Operator Area', text: 'Seat, seatbelt, and mirrors are in good condition and adjusted', crit: true },
            { section: 'Cabin / Operator Area', text: 'Cabin glass and FOPS/ROPS structure intact and clean', crit: true },
            { section: 'Operation', text: 'Test safe load indicator/LMI systems operational', crit: true },
            { section: 'Operation', text: 'Test steering modes (front, crab, 4-wheel) operate correctly', crit: true },
            { section: 'Operation', text: 'Test brakes (foot and parking) ensure holding capacity', crit: true },
            { section: 'Operation', text: 'Test hydraulic functions (lift, extend, tilt) smoothly', crit: true }
        ])
    },
    {
        id: 'mt_frontendloader',
        equipmentTypeId: 'et_frontendloader',
        name: 'Front End Loader Template',
        description: 'Standard inspection for Front End Loaders.',
        items: generateItems('mt_frontendloader', [
            { section: 'External Walkaround', text: 'Check for fluid leaks (oil, coolant, fuel, hydraulic)', crit: true, photo: true },
            { section: 'External Walkaround', text: 'Inspect tires for damage, wear, and correct pressure', crit: true },
            { section: 'External Walkaround', text: 'Check articulation joint and safety locking bar mechanism' },
            { section: 'Attachments', text: 'Check bucket, teeth, cutting edges for wear and damage', crit: true, photo: true },
            { section: 'Attachments', text: 'Check quick hitch mechanism, pins, and keepers secure', crit: true },
            { section: 'Cabin / Operator Area', text: 'Seat, seatbelt, and mirrors are in good condition and adjusted', crit: true },
            { section: 'Cabin / Operator Area', text: 'Cabin glass, wipers, and ROPS structure intact and clean', crit: true },
            { section: 'Operation', text: 'Horn, reversing alarm, and flashing light operational', crit: true },
            { section: 'Operation', text: 'Test brakes (service and park) effectively stop and hold loader', crit: true },
            { section: 'Operation', text: 'Test steering and general hydraulics (lift, tilt) function smoothly', crit: true }
        ])
    },
    {
        id: 'mt_excavator',
        equipmentTypeId: 'et_excavator',
        name: 'Excavator Template',
        description: 'Standard inspection for Excavators.',
        items: generateItems('mt_excavator', [
            { section: 'External Walkaround', text: 'Check for fluid leaks (oil, coolant, fuel, hydraulic)', crit: true, photo: true },
            { section: 'External Walkaround', text: 'Inspect tracks, rollers, sprockets, and idlers for wear/tension', crit: true },
            { section: 'External Walkaround', text: 'Check slew ring, protective guards, and bodywork' },
            { section: 'Attachments', text: 'Check bucket, teeth, and side cutters for wear/damage', crit: true, photo: true },
            { section: 'Attachments', text: 'Check quick hitch mechanism, pins, and locking bolts secure', crit: true },
            { section: 'Lifting Mechanism', text: 'Inspect boom, dipper arm, and hydraulic cylinders for damage/leaks', crit: true },
            { section: 'Cabin / Operator Area', text: 'Seat, seatbelt, and mirrors are in good condition and adjusted', crit: true },
            { section: 'Cabin / Operator Area', text: 'Cabin glass, wipers, and FOPS/ROPS structure intact and clean', crit: true },
            { section: 'Operation', text: 'Test travel alarms and slew brake operational', crit: true },
            { section: 'Operation', text: 'Test all hydraulic functions (boom, dipper, bucket, slew) smoothly', crit: true }
        ])
    },
    {
        id: 'mt_skidsteer',
        equipmentTypeId: 'et_skidsteer',
        name: 'Skid Steer Template',
        description: 'Standard inspection for Skid Steers.',
        items: generateItems('mt_skidsteer', [
            { section: 'External Walkaround', text: 'Check for fluid leaks (oil, coolant, fuel, hydraulic)', crit: true, photo: true },
            { section: 'External Walkaround', text: 'Inspect tires/tracks for damage, wear, and correct pressure/tension', crit: true },
            { section: 'External Walkaround', text: 'Check lift arms and safety strut mechanisms' },
            { section: 'Attachments', text: 'Check bucket/attachment for wear and damage', crit: true, photo: true },
            { section: 'Attachments', text: 'Check attachment locking pins/levers secure fully', crit: true },
            { section: 'Cabin / Operator Area', text: 'Seat, seatbelt, and safety bar are operational and adjusted', crit: true },
            { section: 'Cabin / Operator Area', text: 'ROPS structure intact and side screens securely fitted', crit: true },
            { section: 'Operation', text: 'Horn, reversing alarm, and flashing light operational', crit: true },
            { section: 'Operation', text: 'Test drive, steering, and braking functions effectively', crit: true },
            { section: 'Operation', text: 'Test hydraulic functions (lift, tilt, auxiliary) smoothly', crit: true }
        ])
    },
    {
        id: 'mt_scissorlift',
        equipmentTypeId: 'et_scissorlift',
        name: 'Scissor Lift Template',
        description: 'Standard inspection for Scissor Lifts.',
        items: generateItems('mt_scissorlift', [
            { section: 'External Walkaround', text: 'Check for fluid leaks (oil, battery acid, hydraulic)', crit: true, photo: true },
            { section: 'External Walkaround', text: 'Inspect tires for damage, wear, and ensure they are not loose', crit: true },
            { section: 'Structure', text: 'Check scissor arms, pins, and keepers for damage/missing parts', crit: true },
            { section: 'Structure', text: 'Check pothole protection bars deploy effectively', crit: true },
            { section: 'Platform / Operator Area', text: 'Check platform flooring, rails, and gate latch close securely', crit: true },
            { section: 'Platform / Operator Area', text: 'Harness anchor points intact and secure', crit: true },
            { section: 'Operation', text: 'Test lower control panel and emergency descent mechanisms', crit: true },
            { section: 'Operation', text: 'Test upper control panel (drive, steer, lift) functions smoothly', crit: true },
            { section: 'Operation', text: 'Test drive and lift cut-outs when elevated (limit switches)', crit: true },
            { section: 'Operation', text: 'Horn, tilt alarm, and movement alarms operational', crit: true }
        ])
    },
    {
        id: 'mt_boomlift',
        equipmentTypeId: 'et_boomlift',
        name: 'Boom Lift Template',
        description: 'Standard inspection for Boom Lifts.',
        items: generateItems('mt_boomlift', [
            { section: 'External Walkaround', text: 'Check for fluid leaks (oil, fuel, hydraulic)', crit: true, photo: true },
            { section: 'External Walkaround', text: 'Inspect tires for damage, wear, and ensure they are not loose', crit: true },
            { section: 'Structure', text: 'Inspect boom sections, wear pads, and pivot pins for damage/wear', crit: true },
            { section: 'Platform / Operator Area', text: 'Check platform flooring, rails, and gate latch close securely', crit: true },
            { section: 'Platform / Operator Area', text: 'Harness anchor points intact and secure', crit: true },
            { section: 'Operation', text: 'Test lower control panel and emergency descent mechanisms', crit: true },
            { section: 'Operation', text: 'Test upper control panel (drive, steer, lift/extend/rotate) functions smoothly', crit: true },
            { section: 'Operation', text: 'Test drive and lift cut-outs/limit switches operational', crit: true },
            { section: 'Operation', text: 'Test load/moment sensing systems (if fitted) operational', crit: true },
            { section: 'Operation', text: 'Horn, tilt alarm, and movement alarms operational', crit: true }
        ])
    },
    {
        id: 'mt_lightvehicle',
        equipmentTypeId: 'et_lightvehicle',
        name: 'Light Vehicle Template',
        description: 'Standard inspection for Light Vehicles.',
        items: generateItems('mt_lightvehicle', [
            { section: 'External Walkaround', text: 'Check for fluid leaks (oil, coolant, fuel, brake fluid)', crit: true, photo: true },
            { section: 'External Walkaround', text: 'Inspect tires for damage, wear, and correct pressure (including spare)', crit: true },
            { section: 'External Walkaround', text: 'All lights, indicators, and reflectors clean and operational', crit: true },
            { section: 'External Walkaround', text: 'Windscreen intact, no critical cracks, wipers operational', crit: true },
            { section: 'Cabin / Operator Area', text: 'Seat, seatbelt, and mirrors are in good condition and adjusted', crit: true },
            { section: 'Cabin / Operator Area', text: 'Dashboard warning lights extinguish after engine startup', crit: true },
            { section: 'Operation', text: 'Horn and reversing alarm (if fitted) operational', crit: true },
            { section: 'Operation', text: 'Test brakes (foot and parking) ensure holding capacity', crit: true },
            { section: 'Safety Equipment', text: 'First aid kit, fire extinguisher, and breakdown triangles present', crit: false },
            { section: 'Safety Equipment', text: 'Jack and wheel brace present and secure', crit: false }
        ])
    },
    {
        id: 'mt_ute',
        equipmentTypeId: 'et_ute',
        name: 'Ute / Utility Vehicle Template',
        description: 'Standard inspection for Utes and Utility Vehicles.',
        items: generateItems('mt_ute', [
            { section: 'External Walkaround', text: 'Check for fluid leaks (oil, coolant, fuel, brake fluid)', crit: true, photo: true },
            { section: 'External Walkaround', text: 'Inspect tires for wear and pressure (including spare)', crit: true },
            { section: 'External Walkaround', text: 'All lights, indicators, and reflectors clean and operational', crit: true },
            { section: 'External Walkaround', text: 'Windscreen intact, no critical cracks, wipers operational', crit: true },
            { section: 'Tray & Towing', text: 'Check tray/canopy secure, drop sides latch correctly', crit: true },
            { section: 'Tray & Towing', text: 'Tow hitch secure, locking pin present, wiring plug intact', crit: true },
            { section: 'Cabin / Operator Area', text: 'Seat, seatbelt, and mirrors are in good condition', crit: true },
            { section: 'Operation', text: 'Test horn, reversing alarm/camera, and brakes (foot & park)', crit: true },
            { section: 'Safety Equipment', text: 'First aid kit, fire extinguisher, and breakdown triangles present', crit: false }
        ])
    },
    {
        id: 'mt_tiptruck',
        equipmentTypeId: 'et_tiptruck',
        name: 'Tip Truck Template',
        description: 'Standard inspection for Tip Trucks.',
        items: generateItems('mt_tiptruck', [
            { section: 'External Walkaround', text: 'Check for fluid leaks (oil, coolant, fuel, hydraulic)', crit: true, photo: true },
            { section: 'External Walkaround', text: 'Inspect tires for damage, wear, pressure, and clear of debris between duals', crit: true },
            { section: 'External Walkaround', text: 'All lights, reflectors, and clearance beacons clean and operational', crit: true },
            { section: 'Tipper Body', text: 'Check tailgate latches and safety chains secure', crit: true },
            { section: 'Tipper Body', text: 'Hydraulic hoist cylinder free of leaks or scoring', crit: true },
            { section: 'Tipper Body', text: 'Load cover/tarp mechanism intact and operational', crit: false },
            { section: 'Cabin / Operator Area', text: 'Seat, seatbelt, and mirrors are in good condition', crit: true },
            { section: 'Operation', text: 'Horn, reversing alarm, and flashing lights operational', crit: true },
            { section: 'Operation', text: 'Test air brakes (build up time, no leaks, audible drops)', crit: true },
            { section: 'Operation', text: 'Test PTO and tipper controls function correctly', crit: true }
        ])
    },
    {
        id: 'mt_woodchipper',
        equipmentTypeId: 'et_woodchipper',
        name: 'Wood Chipper Template',
        description: 'Standard inspection for Wood Chippers.',
        items: generateItems('mt_woodchipper', [
            { section: 'External Walkaround', text: 'Check for fluid leaks (oil, fuel, hydraulic)', crit: true, photo: true },
            { section: 'External Walkaround', text: 'Inspect tires for wear/pressure and chassis components for cracks', crit: true },
            { section: 'Towing', text: 'Tow hitch secure, safety chains crossed/secured, wiring connected', crit: true },
            { section: 'Chipping Mechanism', text: 'Inspect belts, sheaves, and pulleys for tension/wear', crit: true },
            { section: 'Chipping Mechanism', text: 'Check chipper blades secure and housing bolts tight', crit: true },
            { section: 'Chipping Mechanism', text: 'Infeed chute and feed rollers clear of debris and damage', crit: true },
            { section: 'Safety Mechanisms', text: 'Test emergency stop bars/buttons cut engine & feed rollers', crit: true, photo: true },
            { section: 'Safety Mechanisms', text: 'All guards and covers are secured in place', crit: true },
            { section: 'Operation', text: 'Engine starts cleanly, idles smoothly, and operating controls respond', crit: true }
        ])
    }
];

// Helper to get a template for a given equipment type
export const getTemplateForEquipmentType = (typeId: string): MasterChecklistTemplate | undefined => {
    return MASTER_TEMPLATES.find(t => t.equipmentTypeId === typeId);
};
