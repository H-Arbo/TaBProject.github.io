import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loading from '../components/Loading';
import Pat_Navbar from '../components/Pat_Navbar';


const YellowZone = () => {
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);

    const changeToFalse = () => {
        setEditMode(false);
    }

    useEffect(() => {
        setLoading(true);
        axios
            .get('http://localhost:5555/profile', { withCredentials: true })
            .then((response) => {
                setPatient(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching patient profile:', error);
                setLoading(false);
            });
    }, []);

    return (
        <>
            <Pat_Navbar />
            <div className='p-9'>
                {loading ? (
                    <Loading />
                ) : patient ? (
                    <div className='flex justify-center items-center'>
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                            {patient.yz_meds && patient.yz_meds.length > 0 && (
                                <div className='border border-yellow-600 rounded-md'>
                                    <h2 className='bg-yellow-200 text-gray-800 text-lg font-bold p-3 text-center'>Yellow Zone</h2>
                                    <table className='w-full'>
                                        <tbody>
                                            <tr>
                                                <td className='p-3 border-b border-r border-t border-yellow-600 text-center'>Peak Flow Max: {patient.yz_peak_flow_max}</td>
                                                <td className='p-3 border-b border-t border-yellow-600 text-center'>Peak Flow Min: {patient.yz_peak_flow_min}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <table className='w-full'>
                                        <thead>
                                            <tr className='bg-yellow-200'>
                                                <th className='p-3 border-r border-b border-yellow-600'>Medication</th>
                                                <th className='p-3 border-r border-b border-yellow-600'>Amount</th>
                                                <th className='p-3 border-b border-yellow-600'>Frequency</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {patient.yz_meds.map((medication, index) => (
                                                <tr key={index}>
                                                    <td className='p-3 border-r border-b border-yellow-600'>{medication.med}</td>
                                                    <td className='p-3 border-r border-b border-yellow-600'>{medication.amount}</td>
                                                    <td className='p-3 border-b border-yellow-600'>{medication.when_freq}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-gray-600">No patient profile found</p>
                )}
            </div>
        </>
    );

};

export default YellowZone