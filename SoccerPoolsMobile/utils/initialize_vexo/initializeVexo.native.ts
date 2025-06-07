import { vexo } from 'vexo-analytics';
export default function initializeVexo () { vexo(process.env.VEXO_API_KEY); }
