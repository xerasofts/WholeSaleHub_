import React, { useMemo, useState } from 'react'
import { useSharedQueue } from '../hooks/useSharedQueue'
import { clinicDoctors } from '../data/dummyData'
import '../index.css'

function formatISO(date) {
  return new Date(date).toISOString().split('T')[0]
}

function buildCSV(rows) {
  const headers = ['Date','Doctor','Patient','Token','Visit Type','Diagnosis','Symptoms','Prescription','Amount']
  const lines = [headers.join(',')]
  rows.forEach(r => {
    const vals = [r.date, r.doctor || '', r.patientName, r.tokenNumber || '', r.visitType || '', (r.diagnosis||'').replace(/\n/g,' '), (r.symptoms||'').replace(/\n/g,' '), (r.prescription||'').replace(/\n/g,' '), (r.finalAmount != null ? r.finalAmount : '')]
    lines.push(vals.map(v => '"' + String(v).replace(/"/g,'""') + '"').join(','))
  })
  return lines.join('\n')
}

export default function DoctorLogs() {
  const { patients, setPatients } = useSharedQueue()
  const [period, setPeriod] = useState('daily') // daily, weekly, monthly, yearly
  const [selectedDoctorId, setSelectedDoctorId] = useState('all') // 'all' or doctor id

  const doctorMap = useMemo(() => {
    const m = { all: 'All Doctors' }
    clinicDoctors.forEach(d => { m[d.id] = d.name })
    return m
  }, [])

  const today = useMemo(() => {
    const d = new Date()
    d.setHours(0,0,0,0)
    return d
  }, [])

  const visits = useMemo(() => {
    const all = []
    patients.forEach(p => {
      (p.visitHistory || []).forEach(v => {
        if (!v || !v.date) return
        all.push({ ...v, patientName: p.name, tokenNumber: p.tokenNumber, visitType: p.visitType, patientId: p.id })
      })
    })

    // filter by doctor selection
    const doctorName = selectedDoctorId === 'all' ? null : doctorMap[selectedDoctorId]
    let filtered = all.filter(v => {
      if (doctorName && v.doctor !== doctorName) return false

      const vd = new Date(v.date)
      vd.setHours(0,0,0,0)
      if (period === 'daily') {
        return formatISO(v.date) === formatISO(today)
      }
      if (period === 'weekly') {
        const diff = (today - vd) / (1000*60*60*24)
        return diff >= 0 && diff < 7
      }
      if (period === 'monthly') {
        return vd.getFullYear() === today.getFullYear() && vd.getMonth() === today.getMonth()
      }
      if (period === 'yearly') {
        return vd.getFullYear() === today.getFullYear()
      }
      return true
    })

    return filtered.sort((a,b) => (new Date(b.date) - new Date(a.date)))
  }, [patients, period, selectedDoctorId, doctorMap, today])

  const downloadCSV = () => {
    const csv = buildCSV(visits)
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    const sel = selectedDoctorId === 'all' ? 'All' : selectedDoctorId
    a.href = url
    a.download = `clinic_visits_${sel}_${period}_${formatISO(today)}.csv`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  const handleDelete = (patientId, visitDate) => {
    if (!confirm('Delete this visit from records? This cannot be undone.')) return
    setPatients(prev => prev.map(p => {
      if (p.id === patientId) {
        return { ...p, visitHistory: (p.visitHistory || []).filter(v => v.date !== visitDate) }
      }
      return p
    }))
  }

  const handleEdit = (patientId, visitDate) => {
    // Simple prompt-based edit: edit diagnosis and prescription
    const patient = patients.find(p => p.id === patientId)
    if (!patient) return
    const visit = (patient.visitHistory || []).find(v => v.date === visitDate)
    if (!visit) return
    const newDiagnosis = prompt('Edit diagnosis:', visit.diagnosis || '')
    if (newDiagnosis === null) return
    const newPrescription = prompt('Edit prescription:', visit.prescription || '')
    if (newPrescription === null) return
    const newSymptoms = prompt('Edit symptoms:', visit.symptoms || '')
    if (newSymptoms === null) return

    setPatients(prev => prev.map(p => {
      if (p.id === patientId) {
        const updatedHistory = (p.visitHistory || []).map(v => v.date === visitDate ? { ...v, diagnosis: newDiagnosis, prescription: newPrescription, symptoms: newSymptoms } : v)
        return { ...p, visitHistory: updatedHistory }
      }
      return p
    }))
  }

  return (
    <div className="doctor-logs-page">
      <header className="logs-header">
        <h2>Booking Logs — {selectedDoctorId === 'all' ? 'All Doctors' : doctorMap[selectedDoctorId]}</h2>
        <div className="logs-actions">
          <label className="logs-filter">
            Doctor:
            <select value={selectedDoctorId} onChange={(e) => setSelectedDoctorId(e.target.value)}>
              <option value="all">All Doctors</option>
              {clinicDoctors.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </label>
          <label className="logs-filter">
            View:
            <select value={period} onChange={(e) => setPeriod(e.target.value)}>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </label>
          <button className="download-btn" onClick={downloadCSV}>⬇ Download CSV</button>
        </div>
      </header>

      <div className="logs-table-wrap">
        {visits.length === 0 ? (
          <div className="empty-logs">No completed visits for selected period.</div>
        ) : (
          <table className="logs-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Doctor</th>
                <th>Patient</th>
                <th>Token</th>
                <th>Visit Type</th>
                <th>Diagnosis</th>
                  <th>Symptoms</th>
                  <th>Prescription</th>
                  <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {visits.map((v, idx) => (
                <tr key={idx}>
                  <td>{new Date(v.date).toLocaleDateString()}</td>
                  <td>{v.doctor || '-'}</td>
                  <td>{v.patientName}</td>
                  <td>{v.tokenNumber || '-'}</td>
                  <td>{v.visitType || '-'}</td>
                  <td>{v.diagnosis || '-'}</td>
                  <td>{v.symptoms || '-'}</td>
                    <td>{v.prescription || '-'}</td>
                    <td>{v.finalAmount != null ? `₹${Number(v.finalAmount).toFixed(2)}` : '-'}</td>
                  <td className="logs-actions-cell">
                    <button className="logs-action-btn edit" onClick={() => handleEdit(v.patientId, v.date)}>✏️ Edit</button>
                    <button className="logs-action-btn delete" onClick={() => handleDelete(v.patientId, v.date)}>🗑 Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
