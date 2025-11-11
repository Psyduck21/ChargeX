import React from 'react';
import { X, Car, ChevronDown } from 'lucide-react';
import apiService from '../../services/api';
import { useToast } from '../ui/Toast';

export default function BookingModal({
  selectedStation,
  bookingData,
  setBookingData,
  setSelectedStation,
  setShowBookingModal,
  vehicles = [],
  slotOptions = [],
  slotsLoading = false,
  slotFetchError = null
}) {
  const toast = useToast();
  if (!selectedStation) return null;

  const resetBookingData = () => setBookingData({
    stationId: null,
    vehicleId: null,
    slotId: null,
    connectorType: '',
    currentBattery: 50,
    date: new Date().toISOString().split('T')[0],
    timeSlot: '',
    duration: 2,
    estimatedCost: 0
  });

  // Generate time slots starting from the next hour
  const generateTimeSlots = () => {
    const slots = [];
    const now = new Date();
    const currentHour = now.getHours();
    const selectedDate = new Date(bookingData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    // If selected date is today, start from next hour, otherwise start from 6 AM
    const startHour = selectedDate.getTime() === today.getTime() ? currentHour + 1 : 6;

    for (let hour = startHour; hour <= 22; hour++) { // Up to 10 PM
      const timeString = `${hour.toString().padStart(2, '0')}:00`;
      const period = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      const label = `${displayHour}:00 ${period}`;
      slots.push({ value: timeString, label });
    }

    return slots;
  };

  const timeSlots = generateTimeSlots();

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Book Charging Station</h2>
            <button
              onClick={() => {
                setSelectedStation(null);
                setShowBookingModal(false);
                resetBookingData();
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{selectedStation.name}</h3>
              <p className="text-gray-600">{selectedStation.address}</p>
            </div>

            {/* Current Battery Level */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Current Battery Level: {bookingData.currentBattery}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={bookingData.currentBattery}
                onChange={(e) => setBookingData({ ...bookingData, currentBattery: parseInt(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0%</span>
                <span>100%</span>
              </div>
            </div>

            {/* Vehicle Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Select Vehicle</label>
              <select
                value={bookingData.vehicleId || ''}
                onChange={(e) => setBookingData({ ...bookingData, vehicleId: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Select a vehicle</option>
                {vehicles.map(vehicle => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.name} ({vehicle.connectorType})
                  </option>
                ))}
              </select>
            </div>

            {/* Slot Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Select Charging Slot</label>
              <select
                value={bookingData.slotId || ''}
                onChange={(e) => {
                  const selectedSlot = slotOptions.find(slot => slot.id === e.target.value);
                  setBookingData({ ...bookingData, slotId: e.target.value, connectorType: selectedSlot ? selectedSlot.connectorType : '' });
                }}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">{slotsLoading ? 'Loading slots...' : 'Select a slot'}</option>
                {!slotsLoading && slotOptions.length === 0 && (
                  <option value="" disabled>No slots available for chosen time/duration</option>
                )}
                {!slotsLoading && slotOptions.map(slot => (
                  <option key={slot.id} value={slot.id}>{slot.label}</option>
                ))}
              </select>
              {slotFetchError && <p className="text-xs text-red-500 mt-1">Failed to load slots: {slotFetchError}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={bookingData.date}
                  onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Time Slot</label>
                <select
                  value={bookingData.timeSlot}
                  onChange={(e) => setBookingData({ ...bookingData, timeSlot: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">Select time</option>
                  {timeSlots.map(slot => (
                    <option key={slot.value} value={slot.value}>{slot.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Duration: {bookingData.duration} hours</label>
              <input
                type="range"
                min="1"
                max="8"
                value={bookingData.duration}
                onChange={(e) => setBookingData({ ...bookingData, duration: parseInt(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1 hour</span>
                <span>8 hours</span>
              </div>
            </div>

            {/* Booking Summary */}
            {bookingData.vehicleId && bookingData.slotId && bookingData.timeSlot && (
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Booking Summary</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><strong>Vehicle:</strong> {vehicles.find(v => v.id === bookingData.vehicleId)?.name}</p>
                  <p><strong>Connector:</strong> {bookingData.connectorType}</p>
                  <p><strong>Date & Time:</strong> {bookingData.date} at {bookingData.timeSlot}</p>
                  <p><strong>Duration:</strong> {bookingData.duration} hours</p>
                  <p><strong>Current Battery:</strong> {bookingData.currentBattery}%</p>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                onClick={async () => {
                  if (!bookingData.vehicleId) { toast.error('Please select a vehicle'); return; }
                  if (!bookingData.slotId) { toast.error('Please select a charging slot'); return; }
                  if (!bookingData.timeSlot) { toast.error('Please select a time slot'); return; }

                  try {
                    const startDateTime = new Date(`${bookingData.date}T${bookingData.timeSlot}`);
                    const endDateTime = new Date(startDateTime.getTime() + bookingData.duration * 60 * 60 * 1000);

                    const bookingPayload = {
                      vehicle_id: bookingData.vehicleId,
                      station_id: String(selectedStation.id),
                      slot_id: String(bookingData.slotId),
                      start_time: startDateTime.toISOString(),
                      end_time: endDateTime.toISOString(),
                      status: 'pending'
                    };

                    const createdBooking = await apiService.createBooking(bookingPayload);
                    console.log('Booking created successfully:', createdBooking);
                    toast.success('Booking created successfully — status: Pending');
                    setSelectedStation(null);
                    setShowBookingModal(false);
                    resetBookingData();
                  } catch (error) {
                    console.error('Error creating booking:', error);
                    toast.error(error?.message || 'Failed to create booking. Please try again.');
                  }
                }}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all"
              >
                Create Booking
              </button>

              <button
                onClick={() => { setSelectedStation(null); setShowBookingModal(false); resetBookingData(); }}
                className="px-6 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
