import { app } from "@/atoms/kuepa"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { leadService } from "@/services/leadService"
import { LeadData } from "@/services/leadService"
import { Form, Switch } from "radix-ui";
import "../../radix.css";


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
    address: '',
    city: '',
    status: 'active'
  });

  const [trackings, setTrackings] = useState([{ tracking: '', description: '', new: true, name: '' }]);
  const [leads, setLeads] = useState<LeadData[]>([]);
  const [reload, setReload] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, index?: number) => {
    const { name, value } = e.target;
    if (name.startsWith('tracking') || name.startsWith('description') || name.startsWith('name')) {
      const newTrackings = [...trackings];
      newTrackings[index!][name] = value;
      newTrackings[index!]['new'] = true;
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
        setReload(true); // Set reload flag to true
        setFormData({
          full_name: '',
          first_name: '',
          last_name: '',
          email: '',
          mobile_phone: '',
          interestProgram: '',
          address: '',
          city: '',
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

      <Form.Root className="FormRoot" onSubmit={handleSubmit}>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          <div style={{ flex: 1, paddingRight: "20px" }}>
            <Form.Field className="FormField" name="full_name">
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "space-between",
                }}
              >
                <Form.Label className="FormLabel">Nombre Completo</Form.Label>
                <Form.Message className="FormMessage" match="valueMissing">
                  Por favor ingrese su nombre completo
                </Form.Message>
              </div>
              <Form.Control asChild>
                <input className="Input" type="text" name="full_name" value={formData.full_name} onChange={handleChange} required />
              </Form.Control>
            </Form.Field>
            <Form.Field className="FormField" name="first_name">
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "space-between",
                }}
              >
                <Form.Label className="FormLabel">Nombre</Form.Label>
                <Form.Message className="FormMessage" match="valueMissing">
                  Por favor ingrese su nombre
                </Form.Message>
              </div>
              <Form.Control asChild>
                <input className="Input" type="text" name="first_name" value={formData.first_name} onChange={handleChange} required />
              </Form.Control>
            </Form.Field>
            <Form.Field className="FormField" name="last_name">
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "space-between",
                }}
              >
                <Form.Label className="FormLabel">Apellido</Form.Label>
                <Form.Message className="FormMessage" match="valueMissing">
                  Por favor ingrese su apellido
                </Form.Message>
              </div>
              <Form.Control asChild>
                <input className="Input" type="text" name="last_name" value={formData.last_name} onChange={handleChange} required />
              </Form.Control>
            </Form.Field>
            <Form.Field className="FormField" name="email">
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "space-between",
                }}
              >
                <Form.Label className="FormLabel">Email</Form.Label>
                <Form.Message className="FormMessage" match="valueMissing">
                  Por favor ingrese su email
                </Form.Message>
                <Form.Message className="FormMessage" match="typeMismatch">
                  Por favor ingrese un email válido
                </Form.Message>
              </div>
              <Form.Control asChild>
                <input className="Input" type="email" name="email" value={formData.email} onChange={handleChange} required />
              </Form.Control>
            </Form.Field>
            <Form.Field className="FormField" name="mobile_phone">
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "space-between",
                }}
              >
                <Form.Label className="FormLabel">Teléfono Móvil</Form.Label>
                <Form.Message className="FormMessage" match="valueMissing">
                  Por favor ingrese su teléfono móvil
                </Form.Message>
              </div>
              <Form.Control asChild>
                <input className="Input" type="text" name="mobile_phone" value={formData.mobile_phone} onChange={handleChange} required />
              </Form.Control>
            </Form.Field>

          </div>
          <div style={{ flex: 1, paddingRight: "10px" }}>
            <Form.Field className="FormField" name="interestProgram">
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "space-between",
                }}
              >
                <Form.Label className="FormLabel">Programa de Interés</Form.Label>
                <select name="interestProgram" value={formData.interestProgram} onChange={handleChange} required>
                  {DummyPrograms.map(program => (
                    <option key={program._id} value={program._id}>
                      {program.name}
                    </option>
                  ))}
                </select>
              </div>
            </Form.Field>
            <Form.Field className="FormField" name="address">
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "space-between",
                }}
              >
                <Form.Label className="FormLabel">Dirección</Form.Label>
                <Form.Message className="FormMessage" match="valueMissing">
                  Por favor ingrese su dirección
                </Form.Message>
              </div>
              <Form.Control asChild>
                <input className="Input" type="text" name="address" value={formData.address} onChange={handleChange} required />
              </Form.Control>
            </Form.Field>
            <Form.Field className="FormField" name="city">
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "space-between",
                }}
              >
                <Form.Label className="FormLabel">Ciudad</Form.Label>
                <Form.Message className="FormMessage" match="valueMissing">
                  Por favor ingrese su ciudad
                </Form.Message>
              </div>
              <Form.Control asChild>
                <input className="Input" type="text" name="city" value={formData.city} onChange={handleChange} required />
              </Form.Control>
            </Form.Field>
            <Form.Field className="FormField" name="status">
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "space-between",
                }}
              >
                <Form.Label className="FormLabel">Estado</Form.Label>
                <select name="status" value={formData.status} onChange={handleChange}>
                  <option value="active">Activo</option>
                  <option value="inactive">Inactivo</option>
                </select>
              </div>
            </Form.Field>
            <Form.Field className="FormField" name="trackings">
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "space-between",
                }}
              >
                <Form.Label className="FormLabel">Trackings</Form.Label>
              </div>
              {trackings.map((tracking, index) => (
                <div key={index}>
                  <Form.Control asChild>
                    <input
                      className="Input"
                      type="text"
                      name="tracking"
                      value={tracking.tracking}
                      onChange={(e) => handleChange(e, index)}
                      placeholder="Tracking"
                      required
                    />
                  </Form.Control>
                  <Form.Control asChild>
                    <input
                      className="Input"
                      type="text"
                      name="description"
                      value={tracking.description}
                      onChange={(e) => handleChange(e, index)}
                      placeholder="Description"
                      required
                    />
                  </Form.Control>
                  <Form.Control asChild>
                    <input
                      className="Input"
                      type="text"
                      name="name"
                      value={tracking.name}
                      onChange={(e) => handleChange(e, index)}
                      placeholder="Name"
                      required
                    />
                  </Form.Control>
                </div>
              ))}
            </Form.Field>
          </div>
        </div>
        <Form.Submit asChild>
          <button className="Button" style={{ marginTop: 10 }}>
            Guardar Lead
          </button>
        </Form.Submit>
      </Form.Root>
      <h2 className="flex text-2xl font-title text-purple-800">Lista de Leads</h2>
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid black", padding: "8px" }}>Nombre Completo</th>
            <th style={{ border: "1px solid black", padding: "8px" }}>Email</th>
            <th style={{ border: "1px solid black", padding: "8px" }}>Teléfono Móvil</th>
            <th style={{ border: "1px solid black", padding: "8px" }}>Programa de Interés</th>
            <th style={{ border: "1px solid black", padding: "8px" }}>Estado</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead._id}>
              <td style={{ border: "1px solid black", padding: "8px" }}>{lead.full_name}</td>
              <td style={{ border: "1px solid black", padding: "8px" }}>{lead.email}</td>
              <td style={{ border: "1px solid black", padding: "8px" }}>{lead.mobile_phone}</td>
              <td style={{ border: "1px solid black", padding: "8px" }}>{DummyPrograms.find(program => program._id === lead.interestProgram)?.name || "N/A"}</td>
              <td style={{ border: "1px solid black", padding: "8px" }}>{lead.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}