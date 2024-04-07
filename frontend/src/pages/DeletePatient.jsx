import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Dr_Navbar from "../components/Dr_Navbar";
import Loading from "../components/Loading";
import EasyEdit from "react-easy-edit";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const DeletePatient = () => {
    const [patients, setPatients] = useState([]);
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    const nav = useNavigate();
    const location = useLocation();

    useEffect(() => {
        setLoading(true);

        Promise.all([
            axios.get("http://localhost:5555/patients"),
            axios.get("http://localhost:5555/profile", { withCredentials: true }),
        ])
            .then(([patientsResponse, profileResponse]) => {
                setPatients(patientsResponse.data.data);
                setDoctor(profileResponse.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error:", error);
                setLoading(false);
            });
    }, []);

    const filteredPatients = patients.filter((patient) => {
        if (patient.provider_email && typeof patient.provider_email === "string") {
            const targetEmail = doctor.email;
            return (
                patient.provider_email.includes(targetEmail) &&
                patient.email.includes(location.state.email)
            );
        }
        return false;
    });

    const save = async (value) => {
        try {
            const patientId = filteredPatients[0]._id;
            const { data } = await axios.patch("/patients/archivePatient", {
                _id: patientId,
                new_prov: value
            });

            if (data.error) {
                toast.error(data.error);
            } else {
                toast.success("Patient Archived");
                nav("/doctor/home");
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("An error occurred while updating provider email. Please try again.");
        }
    };

    const cancel = () => {
        toast.success("Cancelled");
        nav("/doctor/home");
    };

    return (
        <>
            <Dr_Navbar />
            <div className='p-4'>
                {loading ? <Loading /> : ''}
                <div className='flex flex-col items-center border-2 border-red-400 rounded-x1 w-[600px] p-8 mx-auto'>
                    {filteredPatients.length > 0 ? (
                        <>
                            <h3 className='text-2x1'>Are you sure you want to archive {filteredPatients[0].name}?</h3>
                            <EasyEdit
                                type="datalist"
                                options={[{ label: 'Yes', value: 'Yes' }]}
                                onSave={(value) => {
                                    if (value === 'Yes') {
                                        save(value);
                                    }
                                }}
                                onCancel={cancel}
                                instructions="Select Yes from dropdown or cancel"
                                saveButtonLabel="Save"
                                cancelButtonLabel="Cancel"
                                attributes={{ name: "awesome-input", id: 1 }}
                            />

                        </>
                    ) : (
                        <p>No patient found with the specified criteria.</p>
                    )}
                </div>
            </div>
        </>
    )
};

export default DeletePatient;
