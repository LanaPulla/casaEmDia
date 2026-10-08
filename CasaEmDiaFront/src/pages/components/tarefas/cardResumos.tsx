export default function CardResumo() {
    return (
        <div className=" rounded-4 px-4 py-2 shadow-sm task-card"
            style={{
                backgroundColor: "rgb(250, 249, 246)",
            }}>
            <div className="container">
            
                <div className="row mb-3">
                    <div className="col-6">
                        <div className="card"><div className="card-body">Card 1</div></div>
                    </div>
                    <div className="col-6">
                        <div className="card"><div className="card-body">Card 2</div></div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-6">
                        <div className="card"><div className="card-body">Card 3</div></div>
                    </div>
                    <div className="col-6">
                        <div className="card"><div className="card-body">Card 4</div></div>
                    </div>
                </div>
            </div>

        </div>
    )
}