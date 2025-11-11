#!/usr/bin/env python3
"""
Test Data Setup Script for ChargeX
Creates sample bookings and charging sessions for testing user statistics
"""

import asyncio
import uuid
from datetime import datetime, timedelta, timezone
from backend.app.database import get_supabase_service_role_client
from backend.app.crud.bookings import create_booking
from backend.app.crud.charging_sessions import create_charging_session
from backend.app.models import BookingCreate, ChargingSessionCreate


async def setup_test_data():
    """Set up test data for user statistics testing"""

    print("🚀 Setting up test data for ChargeX...")

    # Initialize Supabase client
    supabase = await get_supabase_service_role_client()

    try:
        # 1. Get existing users (app_users only, not admins/managers)
        print("📋 Checking existing users...")
        users_response = supabase.table("profiles").select("id, name, email").execute()
        all_users = users_response.data or []

        if not all_users:
            print("❌ No users found. Please create some users first.")
            return

        # Filter to get only regular app users (not station managers or admins)
        # Check which users are NOT station managers or admins
        manager_ids = set()
        admin_ids = set()

        try:
            managers_response = supabase.table("station_managers").select("id").execute()
            manager_ids = {m['id'] for m in (managers_response.data or [])}
        except:
            pass

        try:
            admins_response = supabase.table("admins").select("id").execute()
            admin_ids = {a['id'] for a in (admins_response.data or [])}
        except:
            pass

        # Filter users to only regular app users
        users = [u for u in all_users if u['id'] not in manager_ids and u['id'] not in admin_ids]

        if not users:
            print("⚠️  No regular app users found (only managers/admins exist)")
            print("📝 Creating a test user with vehicle for demo purposes...")

            # Create a test user
            test_user_data = {
                'id': str(uuid.uuid4()),
                'name': 'Demo User',
                'email': 'demo@example.com',
                'phone': '9876543210',
                'city': 'Delhi',
                'zip_code': '110001'
            }

            try:
                supabase.table("profiles").insert(test_user_data).execute()
                users = [test_user_data]
                print("✅ Created demo user")
            except Exception as e:
                print(f"❌ Failed to create demo user: {e}")
                return
        else:
            print(f"✅ Found {len(users)} regular app users")

        # 2. Get existing vehicles
        print("🚗 Checking existing vehicles...")
        vehicles_response = supabase.table("vehicles").select("id, owner_id, brand, model").execute()
        vehicles = vehicles_response.data or []

        if not vehicles:
            print("❌ No vehicles found. Please create some vehicles first.")
            return

        print(f"✅ Found {len(vehicles)} vehicles")

        # 3. Get existing stations
        print("🏭 Checking existing stations...")
        stations_response = supabase.table("stations").select("id, name").execute()
        stations = stations_response.data or []

        if not stations:
            print("❌ No stations found. Please create some stations first.")
            return

        print(f"✅ Found {len(stations)} stations")

        # 4. Get existing slots
        print("🔌 Checking existing slots...")
        slots_response = supabase.table("charging_slots").select("id, station_id, connector_type").execute()
        slots = slots_response.data or []

        if not slots:
            print("❌ No charging slots found. Please create some slots first.")
            return

        print(f"✅ Found {len(slots)} charging slots")

        # 5. Create test bookings and charging sessions
        print("📝 Creating test bookings and charging sessions...")

        # Create 3-5 completed bookings per user over the last 60 days (further back to avoid conflicts)
        base_date = datetime.now(timezone.utc) - timedelta(days=60)

        for user in users[:3]:  # Limit to first 3 users for testing
            user_id = user['id']
            user_name = user.get('name', 'Unknown')

            print(f"👤 Creating test data for user: {user_name}")

            # Get user's vehicles
            user_vehicles = [v for v in vehicles if v['owner_id'] == user_id]
            if not user_vehicles:
                print(f"⚠️  No vehicles found for user {user_name}, skipping...")
                continue

            # Create 4 bookings per user with different time slots to avoid conflicts
            time_slots = [
                (9, 11),   # 9 AM - 11 AM
                (14, 16),  # 2 PM - 4 PM
                (18, 20),  # 6 PM - 8 PM
                (22, 0),   # 10 PM - 12 AM (next day)
            ]

            for i in range(4):
                # Select random vehicle, station, slot
                vehicle = user_vehicles[i % len(user_vehicles)]
                station = stations[i % len(stations)]
                slot = slots[i % len(slots)]

                # Create booking dates (spread over last 90 days, every 15 days to avoid conflicts)
                booking_date = base_date + timedelta(days=i * 15 + (i % 5) * 3)
                start_hour, end_hour = time_slots[i % len(time_slots)]
                start_time = booking_date.replace(hour=start_hour, minute=0, second=0)

                if end_hour == 0:
                    # Next day at midnight for overnight sessions
                    end_time = (booking_date + timedelta(days=1)).replace(hour=0, minute=0, second=0)
                else:
                    end_time = booking_date.replace(hour=end_hour, minute=0, second=0)

                # Create booking
                booking_data = {
                    'user_id': user_id,
                    'vehicle_id': vehicle['id'],
                    'station_id': station['id'],
                    'slot_id': slot['id'],
                    'start_time': start_time,
                    'end_time': end_time,
                    'status': 'completed'
                }

                try:
                    booking = await create_booking(BookingCreate(**booking_data))
                    if booking:
                        print(f"✅ Created booking {booking.booking_id} for {user_name}")

                        # Create corresponding charging session
                        session_data = {
                            'booking_id': str(booking.booking_id),
                            'vehicle_id': vehicle['id'],
                            'station_id': station['id'],
                            'user_id': user_id,
                            'slot': slot['id'],
                            'start_time': start_time.isoformat(),
                            'end_time': end_time.isoformat(),
                            'energy_consumed': round(15 + (i * 5) + (i % 3) * 2, 1),  # 15-35 kWh
                            'cost': round((15 + (i * 5) + (i % 3) * 2) * 5, 2),  # ₹5 per kWh
                            'status': 'completed'
                        }

                        session = await create_charging_session(session_data)
                        if session:
                            print(f"⚡ Created charging session with {session_data['energy_consumed']} kWh")
                        else:
                            print("❌ Failed to create charging session")
                    else:
                        print("❌ Failed to create booking")

                except Exception as e:
                    print(f"❌ Error creating test data: {e}")

        print("🎉 Test data setup completed!")
        print("\n📊 You can now test user statistics at: /analytics/user-statistics")
        print("📈 User dashboard should show real energy usage and spending data")

    except Exception as e:
        print(f"❌ Error setting up test data: {e}")


if __name__ == "__main__":
    asyncio.run(setup_test_data())
