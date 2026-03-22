import { css } from '@emotion/react';
import { useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Top, Spacing, Border, Button, Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { formatDate } from 'pages/utils/date';
import { useRooms } from 'pages/hooks/useRooms';
import { useReservations } from 'pages/hooks/useReservations';
import { useMyReservations } from 'pages/hooks/useMyReservations';
import { useCancelReservation } from 'pages/hooks/useCancelReservation';
import { DatePicker } from 'pages/components/DatePicker';
import { MessageBanner } from 'pages/components/MessageBanner';
import { Timeline } from './components/Timeline';
import { MyReservationList } from './components/MyReservationList';

type ReservationStatusRouteState = { message?: string; date?: string };

export function ReservationStatusPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const locationState = location.state as ReservationStatusRouteState | null;

  const [date, setDate] = useState(() =>
    locationState?.date ?? formatDate(new Date())
  );

  const consumedKeyRef = useRef<string>();

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(() => {
    if (locationState?.message && location.key !== consumedKeyRef.current) {
      consumedKeyRef.current = location.key;
      return { type: 'success', text: locationState.message };
    }
    return null;
  });

  // Consume location.state message on subsequent renders (e.g. navigating back)
  if (locationState?.message && location.key !== consumedKeyRef.current) {
    consumedKeyRef.current = location.key;
    setMessage({ type: 'success', text: locationState.message });
  }

  const { data: rooms = [] } = useRooms();
  const { data: reservations = [] } = useReservations(date);
  const { data: myReservationList = [] } = useMyReservations();
  const cancelMutation = useCancelReservation();

  const handleCancel = async (id: string) => {
    try {
      await cancelMutation.mutateAsync(id);
      setMessage({ type: 'success', text: '예약이 취소되었습니다.' });
    } catch {
      setMessage({ type: 'error', text: '취소에 실패했습니다.' });
    }
  };

  return (
    <div css={css`background: ${colors.white}; padding-bottom: 40px;`}>
      <Top.Top03 css={css`padding-left: 24px; padding-right: 24px;`}>
        회의실 예약
      </Top.Top03>

      <Spacing size={24} />

      {/* 날짜 선택 */}
      <div css={css`padding: 0 24px;`}>
        <Text typography="t5" fontWeight="bold" color={colors.grey900}>
          날짜 선택
        </Text>
        <Spacing size={16} />
        <div css={css`display: flex; flex-direction: column; gap: 6px;`}>
          <DatePicker value={date} onChange={setDate} />
        </div>
      </div>

      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />

      {/* 예약 현황 타임라인 */}
      <div css={css`padding: 0 24px;`}>
        <Text typography="t5" fontWeight="bold" color={colors.grey900}>
          예약 현황
        </Text>
        <Spacing size={16} />
        <Timeline rooms={rooms} reservations={reservations} />
      </div>

      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />

      {/* 메시지 배너 */}
      {message && (
        <div css={css`padding: 0 24px;`}>
          <MessageBanner type={message.type} message={message.text} />
          <Spacing size={12} />
        </div>
      )}

      {/* 내 예약 목록 */}
      <div css={css`padding: 0 24px;`}>
        <MyReservationList
          reservations={myReservationList}
          rooms={rooms}
          onCancel={handleCancel}
        />
      </div>

      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />

      {/* 예약하기 버튼 */}
      <div css={css`padding: 0 24px;`}>
        <Button display="full" onClick={() => navigate('/booking')}>
          예약하기
        </Button>
      </div>
      <Spacing size={24} />
    </div>
  );
}
