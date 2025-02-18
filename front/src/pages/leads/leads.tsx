import { app } from "@/atoms/kuepa"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { leadService } from "@/services/leadService"
import { LeadData } from "@/services/leadService"

export interface LeadsProps {
}

export default function Leads(props?: LeadsProps) {

  const DummyPrograms = [
    {
      _id: '67b3eb2943dd86b78f0894f8',
      name: 'Programa 1'
    },
    {
      _id: '67b3eb2943dd86b78f0894fb',
      name: 'Programa 2'
    }
  ]

  const [formData, setFormData] = useState({
    full_name: '',
    first_name: '',
    last_name: '',
    email: '',
    mobile_phone: '',
    interestProgram: DummyPrograms[0]._id,
    status: 'active'
  });

  const [trackings, setTrackings] = useState([{ tracking: '', description: '', new: true, name: '' }]);
  const [leads, setLeads] = useState<LeadData[]>([]);
  const [reload, setReload] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, index?: number) => {
    const { name, value } = e.target;
    if (name.startsWith('tracking') || name.startsWith('description') ||  name.startsWith('name')) {
      const newTrackings = [...trackings];
      newTrackings[index!][name] = value;
      setTrackings(newTrackings);
    } if ( name.startsWith('new') ) {
      const newTrackings = [...trackings];
      newTrackings[index]['new'] = !newTrackings[index]['new'];
      setTrackings(newTrackings);
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await leadService.create({ ...formData, trackings });
      if (response) {
        alert('Lead creado exitosamente');
        setReload(true); // Set reload flag to true
        setFormData({
          full_name: '',
          first_name: '',
          last_name: '',
          email: '',
          mobile_phone: '',
          interestProgram: '',
          status: 'active'
        });
        setTrackings([{ tracking: '', description: '', new: true, name: '' }]);
      } else {
        alert('Error al crear el lead: ' + response);
      }
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      alert('Error al crear el lead');
    }
  };

  useEffect(() => {
    app.set({
      ...(app.get() || {}),
      app: 'kuepa',
      module: 'leads',
      window: 'crm',
      back: null,
      accent: 'purple',
      breadcrumb: [
        {
          title: 'Leads',
          url: '/leads'
        }
      ]
    })
  }, [])

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const leadsList = await leadService.getAll();
        setLeads(leadsList);
      } catch (error) {
        console.error("Error fetching leads:", error);
      }
    };

    fetchLeads();
  }, [reload]); 

  useEffect(() => {
    if (reload) {
      setReload(false); 
    }
  }, [reload]);

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre Completo:</label>
          <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} required />
        </div>
        <div>
          <label>Nombre:</label>
          <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} required />
        </div>
        <div>
          <label>Apellido:</label>
          <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} required />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div>
          <label>Teléfono Móvil:</label>
          <input type="text" name="mobile_phone" value={formData.mobile_phone} onChange={handleChange} required />
        </div>
        <div>
          <label>Programa de Interés:</label>
          <select name="interestProgram" value={formData.interestProgram} onChange={handleChange} required>
            {DummyPrograms.map(program => (
              <option key={program._id} value={program._id}>
                {program.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Estado:</label>
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="active">Activo</option>
            <option value="inactive">Inactivo</option>
          </select>
        </div>
        <div>
          <label>Trackings:</label>
          {trackings.map((tracking, index) => (
            <div key={index}>
              <input
                type="text"
                name="tracking"
                value={tracking.tracking}
                onChange={(e) => handleChange(e, index)}
                placeholder="Tracking"
                required
              />
              <input
                type="text"
                name="description"
                value={tracking.description}
                onChange={(e) => handleChange(e, index)}
                placeholder="Description"
                required
              />
              <input
                type="text"
                name="name"
                value={tracking.name}
                onChange={(e) => handleChange(e, index)}
                placeholder="Name"
                required
              />
              <input
                type="checkbox"
                name="new"
                checked={tracking.new}
                onChange={(e) => handleChange(e, index)}
              />
            </div>
          ))}
        </div>
        <button type="submit">Guardar Lead</button>
      </form>
      <h2 className="flex text-2xl font-title text-purple-800">Lista de Leads</h2>
      <table>
        <thead>
          <tr>
            <th>Nombre Completo</th>
            <th>Email</th>
            <th>Teléfono Móvil</th>
            <th>Programa de Interés</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead._id}>
              <td>{lead.full_name}</td>
              <td>{lead.email}</td>
              <td>{lead.mobile_phone}</td>
              <td>{DummyPrograms.find(program => program._id === lead.interestProgram)?.name || "N/A"}</td>
              <td>{lead.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}