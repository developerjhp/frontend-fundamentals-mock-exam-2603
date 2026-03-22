import { css } from '@emotion/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Top, Spacing, Border } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import axios from 'axios';
import type { ServerErrorData } from 'pages/types';
import { getAvailableRooms, getUniqueFloors } from 'pages/utils/filterRooms';
import { useBookingFilters } from 'pages/hooks/useBookingFilters';
import { useRooms } from 'pages/hooks/useRooms';
import { useReservations } from 'pages/hooks/useReservations';
import { useCreateReservation } from 'pages/hooks/useCreateReservation';
import { MessageBanner } from 'pages/components/MessageBanner';
import { FilterPanel } from './components/FilterPanel';
import { RoomSelectionSection } from './components/RoomSelectionSection';

export function RoomBookingPage() {
  const navigate = useNavigate();
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFilterChange = () => {
    setSelectedRoomId(null);
    setErrorMessage(null);
  };

  const { filters, actions, isFilterComplete, validationError } = useBookingFilters(handleFilterChange);

  const { data: rooms } = useRooms();
  const { data: reservations } = useReservations(filters.date);
  const createMutation = useCreateReservation();

  const floors = getUniqueFloors(rooms ?? []);
  const showRoomSection = isFilterComplete && !validationError;
  const availableRooms = showRoomSection ? getAvailableRooms(rooms ?? [], reservations ?? [], filters) : [];

  const handleBook = async () => {
    if (!selectedRoomId) {
      setErrorMessage('회의실을 선택해주세요.');
      return;
    }

    try {
      await createMutation.mutateAsync({
        roomId: selectedRoomId,
        date: filters.date,
        start: filters.startTime,
        end: filters.endTime,
        attendees: filters.attendees,
        equipment: filters.equipment,
      });

      navigate('/', { state: { message: '예약이 완료되었습니다!', date: filters.date } });
    } catch (err: unknown) {
      let serverMessage = '예약에 실패했습니다.';
      if (axios.isAxiosError(err)) {
        const data = err.response?.data as ServerErrorData | undefined;
        serverMessage = data?.message ?? serverMessage;
      }
      setErrorMessage(serverMessage);
      setSelectedRoomId(null);
    }
  };

  return (
    <div css={css`background: ${colors.white}; padding-bottom: 40px;`}>
      <div css={css`padding: 12px 24px 0;`}>
        <button
          type="button"
          onClick={() => navigate('/')}
          aria-label="뒤로가기"
          css={css`
            background: none; border: none; padding: 0; cursor: pointer; font-size: 14px;
            color: ${colors.grey600}; &:hover { color: ${colors.grey900}; }
          `}
        >
          ← 예약 현황으로
        </button>
      </div>
      <Top.Top03 css={css`padding-left: 24px; padding-right: 24px;`}>
        예약하기
      </Top.Top03>

      {errorMessage && (
        <div css={css`padding: 0 24px;`}>
          <Spacing size={12} />
          <MessageBanner type="error" message={errorMessage} />
        </div>
      )}

      <Spacing size={24} />

      <FilterPanel
        filters={filters}
        onDateChange={actions.setDate}
        onStartTimeChange={actions.setStartTime}
        onEndTimeChange={actions.setEndTime}
        onAttendeesChange={actions.setAttendees}
        onEquipmentToggle={actions.toggleEquipment}
        onFloorChange={actions.setPreferredFloor}
        validationError={validationError}
        floors={floors}
      />

      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />

      {showRoomSection && (
        <RoomSelectionSection
          rooms={availableRooms}
          selectedRoomId={selectedRoomId}
          onSelectRoom={setSelectedRoomId}
          onBook={handleBook}
          isBooking={createMutation.isLoading}
        />
      )}

      <Spacing size={24} />
    </div>
  );
}
