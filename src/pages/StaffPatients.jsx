import React, { useMemo, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSharedQueue } from '../hooks/useSharedQueue'
import { clinicDoctors } from '../data/dummyData'
import '../index.css'

export default function StaffPatients() {
  const navigate = useNavigate()
  const { patients, setPatients } = useSharedQueue()
  const [q, setQ] = useState('')
  const [doctorFilter, setDoctorFilter] = useState('all')
  const [expanded, setExpanded] = useState(null)
  const [editPatient, setEditPatient] = useState(null)

  const doctorMap = useMemo(() => {
    const m = { all: 'All Doctors' }
    clinicDoctors.forEach(d => { m[d.id] = d.name })
    return m
  }, [])

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase()
    return patients
      .filter(p => {
        if (doctorFilter !== 'all' && p.assignedDoctorId !== doctorFilter) return false
        if (!term) return true
        return (p.name || '').toLowerCase().includes(term)
          || (p.phone || '').includes(term)
          || (String(p.tokenNumber || '')).toLowerCase().includes(term)
      })
      .sort((a,b) => (a.name || '').localeCompare(b.name || ''))
  }, [patients, q, doctorFilter])

  useEffect(() => {
    if (expanded == null) {
      setEditPatient(null)
    } else {
      const p = patients.find(x => x.id === expanded)
      setEditPatient(p ? JSON.parse(JSON.stringify(p)) : null)
    }
  }, [expanded, patients])

  return (
    <div className="patients-page">
      <div className="patients-header">
        <div>
          <h2>Patients — Detailed Listing</h2>
          <p className="muted">Comprehensive patient information and past visit history.</p>
        </div>

        <div className="patients-controls">
          <input
            className="patients-search"
            placeholder="Search by name, phone or token"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <select value={doctorFilter} onChange={(e) => setDoctorFilter(e.target.value)}>
            <option value="all">All Doctors</option>
            {clinicDoctors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
          <button className="small-btn" onClick={() => {
            // Build rows for export: one row per visit (or empty visit row)
            const exportRows = []
            rows.forEach(p => {
              if (p.visitHistory && p.visitHistory.length > 0) {
                p.visitHistory.forEach(v => {
                  exportRows.push({
                    patientId: p.id,
                    patientName: p.name,
                    phone: p.phone || '',
                    age: p.age || '',
                    gender: p.gender || '',
                    assignedDoctor: clinicDoctors.find(d => d.id === p.assignedDoctorId)?.name || p.assignedDoctorId || '',
                    status: p.status || '',
                    visitDate: v.date || '',
                    visitType: p.visitType || '',
                    symptoms: v.symptoms || '',
                    diagnosis: v.diagnosis || '',
                    caseRecord: v.caseRecord || '',
                    treatments: v.treatments || '',
                    prescription: v.prescription || '',
                    medicalHistory: p.medicalHistory || ''
                  })
                })
              } else {
                exportRows.push({
                  patientId: p.id,
                  patientName: p.name,
                  phone: p.phone || '',
                  age: p.age || '',
                  gender: p.gender || '',
                  assignedDoctor: clinicDoctors.find(d => d.id === p.assignedDoctorId)?.name || p.assignedDoctorId || '',
                  status: p.status || '',
                  visitDate: '',
                  visitType: p.visitType || '',
                  symptoms: '',
                  diagnosis: '',
                  caseRecord: '',
                  treatments: '',
                  prescription: '',
                  medicalHistory: p.medicalHistory || ''
                })
              }
            })

            // Build HTML table for Excel (include medical history)
            const headers = ['Patient ID','Patient Name','Phone','Age','Gender','Assigned Doctor','Status','Medical History','Visit Date','Visit Type','Symptoms','Diagnosis','Case Record','Treatments','Prescription','Amount']
            let table = '<table><thead><tr>' + headers.map(h => `<th>${h}</th>`).join('') + '</tr></thead><tbody>'
              exportRows.forEach(r => {
                table += '<tr>' + [r.patientId, r.patientName, r.phone, r.age, r.gender, r.assignedDoctor, r.status, (r.medicalHistory||''), r.visitDate, r.visitType, (r.symptoms||''), (r.diagnosis||''), (r.caseRecord||''), (r.treatments||''), (r.prescription||''), (r.finalAmount != null ? r.finalAmount : '')].map(c => `<td>${String(c).replace(/</g,'&lt;')}</td>`).join('') + '</tr>'
            })
            table += '</tbody></table>'

            const html = `\uFEFF<html><head><meta charset="UTF-8"></head><body>${table}</body></html>`
            const blob = new Blob([html], { type: 'application/vnd.ms-excel' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            const d = new Date().toISOString().split('T')[0]
            a.download = `patients_export_${d}.xls`
            document.body.appendChild(a)
            a.click()
            a.remove()
            URL.revokeObjectURL(url)
          }}>Export Excel</button>
        </div>
      </div>

      <div className="patients-table-wrap">
        <table className="patients-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Doctor</th>
              <th>Status</th>
              <th>Last Visit</th>
              <th>Visits</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(p => {
              const last = (p.visitHistory || []).slice().sort((a,b) => new Date(b.date) - new Date(a.date))[0]
              return (
                <React.Fragment key={p.id}>
                  <tr className="patient-row">
                    <td className="patient-name">{p.name}</td>
                    <td>{p.phone || '-'}</td>
                    <td>{p.age ?? '-'}</td>
                    <td>{p.gender || '-'}</td>
                    <td>{clinicDoctors.find(d => d.id === p.assignedDoctorId)?.name || p.assignedDoctorId || '-'}</td>
                    <td>{p.status}</td>
                    <td>{last ? new Date(last.date).toLocaleDateString() : '-'}</td>
                    <td>{(p.visitHistory || []).length}</td>
                    <td className="patients-row-actions">
                      <button className="small-btn" onClick={() => setExpanded(expanded === p.id ? null : p.id)}>Details</button>
                    </td>
                  </tr>

                  {expanded === p.id && editPatient && (
                    <tr className="patient-details-row">
                      <td colSpan={9}>
                        <div className="patient-details">
                          <div className="pd-left">
                            <div className="details-header">
                              <div>
                                <h3>{p.name} — Patient Details</h3>
                                <div className="muted">ID: {p.id} • {clinicDoctors.find(d => d.id === p.assignedDoctorId)?.name || p.assignedDoctorId}</div>
                              </div>
                              <div>
                                <button className="small-btn ghost" onClick={() => setExpanded(null)}>Collapse Details</button>
                              </div>
                            </div>
                            <h4>Patient Medical History</h4>
                            <textarea className="editable-textarea" value={editPatient.medicalHistory || ''} onChange={(e) => setEditPatient(prev => ({ ...prev, medicalHistory: e.target.value }))} />
                            <div className="patient-save-actions">
                              <button className="small-btn" onClick={() => {
                                // Save entire patient object
                                setPatients(prev => prev.map(x => x.id === editPatient.id ? editPatient : x))
                                setExpanded(null)
                              }}>Save</button>
                              <button className="small-btn ghost" onClick={() => { setExpanded(null); }}>Cancel</button>
                            </div>

                            <h4 style={{ marginTop: 12 }}>Visit History</h4>
                            {editPatient.visitHistory && editPatient.visitHistory.length > 0 ? (
                              <div className="visit-list">
                                {editPatient.visitHistory.slice().sort((a,b)=> new Date(b.date)-new Date(a.date)).map((v, i) => (
                                  <div key={i} className="visit-card">
                                    <div className="visit-meta">
                                      <div className="visit-date">{new Date(v.date).toLocaleDateString()}</div>
                                      <div className="visit-doctor">{v.doctor}</div>
                                      <div className="visit-actions">
                                        <button className="small-btn" onClick={() => {
                                          // persist whole patient (with edited visit)
                                          setPatients(prev => prev.map(x => x.id === editPatient.id ? editPatient : x))
                                        }}>Save Visit</button>
                                        <button className="small-btn ghost" onClick={() => {
                                          if (!confirm('Delete this visit entry?')) return
                                          // remove visit from editPatient and persist
                                          setEditPatient(prev => {
                                            const copy = { ...prev }
                                            copy.visitHistory = copy.visitHistory.filter((_, idx) => idx !== i)
                                            return copy
                                          })
                                          setTimeout(() => {
                                            setPatients(prev => prev.map(x => x.id === editPatient.id ? ({ ...editPatient, visitHistory: (editPatient.visitHistory || []).filter((_, idx) => idx !== i) }) : x))
                                          }, 0)
                                        }}>Delete</button>
                                      </div>
                                    </div>
                                    <div className="visit-body">
                                      <div className="visit-grid">
                                        <div>
                                          <label>Symptoms</label>
                                          <textarea value={v.symptoms || ''} onChange={(e) => setEditPatient(prev => {
                                            const copy = JSON.parse(JSON.stringify(prev))
                                            copy.visitHistory[i].symptoms = e.target.value
                                            return copy
                                          })} />
                                        </div>
                                        <div>
                                          <label>Diagnosis</label>
                                          <input value={v.diagnosis || ''} onChange={(e) => setEditPatient(prev => {
                                            const copy = JSON.parse(JSON.stringify(prev))
                                            copy.visitHistory[i].diagnosis = e.target.value
                                            return copy
                                          })} />
                                        </div>
                                        <div>
                                          <label>Case Record</label>
                                          <textarea value={v.caseRecord || ''} onChange={(e) => setEditPatient(prev => {
                                            const copy = JSON.parse(JSON.stringify(prev))
                                            copy.visitHistory[i].caseRecord = e.target.value
                                            return copy
                                          })} />
                                        </div>
                                        <div>
                                          <label>Treatments</label>
                                          <input value={v.treatments || ''} onChange={(e) => setEditPatient(prev => {
                                            const copy = JSON.parse(JSON.stringify(prev))
                                            copy.visitHistory[i].treatments = e.target.value
                                            return copy
                                          })} />
                                        </div>
                                        <div>
                                          <label>Amount</label>
                                          <input type="number" value={v.finalAmount || ''} onChange={(e) => setEditPatient(prev => {
                                            const copy = JSON.parse(JSON.stringify(prev))
                                            copy.visitHistory[i].finalAmount = e.target.value === '' ? '' : parseFloat(e.target.value)
                                            return copy
                                          })} />
                                        </div>
                                        <div style={{ gridColumn: '1 / -1' }}>
                                          <label>Prescription</label>
                                          <textarea value={v.prescription || ''} onChange={(e) => setEditPatient(prev => {
                                            const copy = JSON.parse(JSON.stringify(prev))
                                            copy.visitHistory[i].prescription = e.target.value
                                            return copy
                                          })} />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="muted">No past visits recorded.</div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
