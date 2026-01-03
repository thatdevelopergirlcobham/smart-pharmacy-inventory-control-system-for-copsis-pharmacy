export default function AlertsPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-slate-800">Notifications & Alerts</h1>

            <div className="space-y-4">
                {[
                    { title: "Low Stock Warning", message: "Paracetamol 500mg is below safety stock level.", time: "2 hours ago", type: "warning" },
                    { title: "Expiry Alert", message: "Amoxicillin batch #452 expires in 30 days.", time: "5 hours ago", type: "critical" },
                    { title: "System Update", message: "System maintenance scheduled for tonight at 2 AM.", time: "1 day ago", type: "info" },
                ].map((alert, i) => (
                    <div key={i} className={`p-4 rounded-xl border flex justify-between items-start ${alert.type === 'critical' ? 'bg-red-50 border-red-100' :
                            alert.type === 'warning' ? 'bg-orange-50 border-orange-100' :
                                'bg-blue-50 border-blue-100'
                        }`}>
                        <div>
                            <h3 className={`font-semibold ${alert.type === 'critical' ? 'text-red-800' :
                                    alert.type === 'warning' ? 'text-orange-800' :
                                        'text-blue-800'
                                }`}>{alert.title}</h3>
                            <p className="text-slate-600 mt-1">{alert.message}</p>
                        </div>
                        <span className="text-xs text-slate-500 font-medium">{alert.time}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
