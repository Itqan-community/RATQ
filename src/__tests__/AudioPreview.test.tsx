import { act, fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  AudioPreview,
  formatAudioTime,
  getAudioFormat,
} from '@/modules/resources/components/preview/AudioPreview';
import { LanguageProvider } from '@/shared/ui/i18n/LanguageContext';

function renderPlayer(
  overrides: Record<string, string | undefined> = {},
  locale: 'ar' | 'en' = 'en',
) {
  localStorage.setItem('ratq_locale', locale);

  const result = render(
    <LanguageProvider>
      <AudioPreview
        data={{
          audio_title: 'Surah Al-Fatiha',
          audio_url: 'https://example.com/fatiha.mp3',
          ...overrides,
        }}
      />
    </LanguageProvider>,
  );

  act(() => {});
  return result;
}

beforeEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe('getAudioFormat', () => {
  it('reads the format from the file extension', () => {
    expect(getAudioFormat('https://example.com/audio/file.mp3')).toBe('MP3');
  });

  it('ignores query strings when reading the extension', () => {
    expect(
      getAudioFormat('https://example.com/audio/file.ogg?token=abc'),
    ).toBe('OGG');
  });

  it('returns null instead of guessing when there is no extension', () => {
    expect(getAudioFormat('https://example.com/audio/file')).toBeNull();
  });
});

describe('formatAudioTime', () => {
  it('formats seconds as minutes and seconds', () => {
    expect(formatAudioTime(65)).toBe('1:05');
  });

  it('handles invalid durations safely', () => {
    expect(formatAudioTime(Number.NaN)).toBe('0:00');
  });
});

describe('AudioPreview', () => {
  it('renders the custom player with title, reciter, quality and format', () => {
    renderPlayer({
      reciter_name: 'Example Reciter',
      audio_quality: '128kbps',
    });

    expect(
      screen.getByRole('region', { name: 'Audio player' }),
    ).toBeInTheDocument();

    expect(screen.getByText('Surah Al-Fatiha')).toBeInTheDocument();
    expect(screen.getByText(/Example Reciter/)).toBeInTheDocument();
    expect(screen.getByText(/Quality: 128kbps/)).toBeInTheDocument();
    expect(screen.getByText(/Format: MP3/)).toBeInTheDocument();
  });

  it('hides optional reciter and quality fields when absent', () => {
    renderPlayer({
      audio_url: 'https://example.com/audio',
    });

    expect(screen.queryByText(/Reciter:/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Quality:/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Format:/)).not.toBeInTheDocument();
  });

  it('uses native accessible controls rather than the browser audio controls', () => {
    const { container } = renderPlayer();

    const playButton = screen.getByRole('button', { name: 'Play audio' });
    const slider = screen.getByRole('slider', { name: 'Audio progress' });
    const audio = container.querySelector('audio');

    expect(playButton.tagName).toBe('BUTTON');
    expect(slider).toHaveAttribute('type', 'range');
    expect(slider).toHaveAttribute('dir', 'ltr');
    expect(audio).not.toHaveAttribute('controls');
  });

  it('seeks when the progress control changes', () => {
    const { container } = renderPlayer();
    const audio = container.querySelector('audio') as HTMLAudioElement;

    Object.defineProperty(audio, 'duration', {
      configurable: true,
      value: 120,
    });

    Object.defineProperty(audio, 'currentTime', {
      configurable: true,
      writable: true,
      value: 0,
    });

    fireEvent.loadedMetadata(audio);

    const slider = screen.getByRole('slider', { name: 'Audio progress' });

    expect(slider).toHaveAttribute('max', '120');

    fireEvent.change(slider, { target: { value: '30' } });

    expect(audio.currentTime).toBe(30);
  });

  it('updates played and remaining time from the audio element', () => {
    const { container } = renderPlayer();
    const audio = container.querySelector('audio') as HTMLAudioElement;

    Object.defineProperty(audio, 'duration', {
      configurable: true,
      value: 120,
    });

    Object.defineProperty(audio, 'currentTime', {
      configurable: true,
      writable: true,
      value: 0,
    });

    fireEvent.loadedMetadata(audio);

    audio.currentTime = 45;
    fireEvent.timeUpdate(audio);

    expect(screen.getByLabelText('Played time')).toHaveTextContent('0:45');
    expect(screen.getByLabelText('Remaining time')).toHaveTextContent('-1:15');
  });

  it('switches the button label when playback starts and pauses', () => {
    const { container } = renderPlayer();
    const audio = container.querySelector('audio') as HTMLAudioElement;

    fireEvent.play(audio);
    expect(
      screen.getByRole('button', { name: 'Pause audio' }),
    ).toBeInTheDocument();

    fireEvent.pause(audio);
    expect(
      screen.getByRole('button', { name: 'Play audio' }),
    ).toBeInTheDocument();
  });

  it('renders accessible Arabic labels', () => {
    renderPlayer({}, 'ar');

    expect(
      screen.getByRole('region', { name: 'مشغل الصوت' }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: 'تشغيل الصوت' }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('slider', { name: 'تقدم الصوت' }),
    ).toBeInTheDocument();
  });
});
