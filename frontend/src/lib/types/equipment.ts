export interface EquipmentType {
    id: string;
    category: string;
    name: string;
}

export type ResponseType = 'OK_FAULT_NA' | 'YES_NO' | 'PASS_FAIL';

export interface MasterChecklistItem {
    id: string;
    templateId: string;
    section_name: string;
    item_text: string;
    response_type: ResponseType;
    is_critical: boolean;
    photo_required: boolean;
    sort_order: number;
}

export interface MasterChecklistTemplate {
    id: string;
    equipmentTypeId: string;
    name: string;
    description: string;
    items: MasterChecklistItem[]; // Included here for easier mock data management
}

export interface Equipment {
    id: string;
    ref: string;
    name: string;
    typeId: string;
    status: 'ready' | 'fault' | 'maintenance';
    description: string;
}

export interface EquipmentChecklistItem {
    id: string; // Unique to this equipment instance, not the master ID
    equipmentId: string;
    section_name: string;
    item_text: string;
    response_type: ResponseType;
    is_critical: boolean;
    photo_required: boolean;
    sort_order: number;
}
