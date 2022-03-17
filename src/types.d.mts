export type Rational = `${number}/${number}`;

export interface FileInfo {
  streams: Stream[];
  chapters: Chapter[];
  format: Format;
}

export interface Format {
  filename: string;
  nb_streams: number;
  nb_programs: number;
  format_name: string;
  format_long_name: string;
  start_time: string;
  duration: string;
  size: string;
  bit_rate: string;
  probe_score: number;
  tags: Record<string, string>;
}

export interface Chapter {
  /**
   * Chapter end time in time_base units
   */
  end: number;
  /**
   * unique ID to identify the chapter
   */
  id: number;
  tags: Record<string, string>;
  /**
   * Chapter start time in time_base units
   */
  start: number;
  /**
   * Time base in which the start/end timestamps are specified
   * @example "1/1000"
   */
  time_base: Rational;
}

export interface Stream {
  index: number;
  codec_name: string;
  codec_long_name: string;
  profile: string;
  codec_type: string;
  codec_tag_string: string;
  codec_tag: string;

  width: number;
  height: number;
  codec_width: number;
  codec_height: number;
  closed_captions: number;
  has_b_frames: number;
  pix_fmt: string;
  level: number;
  color_range: string;
  color_primaries: string;
  chroma_location: string;
  refs: number;
  is_avc: string;
  nal_length_size: string;

  sample_fmt: string;
  sample_rate: string;
  channels: number;
  channel_layout: string;
  bits_per_sample: number;

  r_frame_rate: string;
  avg_frame_rate: string;
  /**
   * This is the fundamental unit of time (in seconds) in terms
   * of which frame timestamps are represented.
   */
  time_base: Rational;
  start_pts: number;
  start_time: string;
  duration_ts: number;
  /**
   * Duration of the stream, in stream time base.
   * If a source file does not specify a duration, but does specify
   * a bitrate, this value will be estimated from bitrate and file size.
   */
  duration: string;
  /**
   * Total stream bitrate in bit/s, 0 if not available.
   */
  bit_rate: string;
  bits_per_raw_sample: string;
  nb_frames: string;
  disposition: Disposition;
  tags: Record<string, string>;
}

export interface Disposition {
  default: 0 | 1;
  dub: 0 | 1;
  original: 0 | 1;
  comment: 0 | 1;
  lyrics: 0 | 1;
  karaoke: 0 | 1;
  forced: 0 | 1;
  hearing_impaired: 0 | 1;
  visual_impaired: 0 | 1;
  clean_effects: 0 | 1;
  attached_pic: 0 | 1;
  timed_thumbnails: 0 | 1;
}

export interface FramesInfo {
  avg_frame_rate: number;
  duration: number;
  frames: Frame[];
  gop_size: number;
  nb_frames: number;
  time_base: number;
}

export interface Frame {
  dts: number;
  frame_number: number;
  pict_type: number;
  pkt_size: number;
  pos: number;
  pts: number;
}
