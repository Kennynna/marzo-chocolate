/**
 * Один непрерывный вайнахский орнамент: цепочка S-образных спиралей,
 * как вертикальный узор на флаге Чечни, но вытянутый в линию.
 *
 * Путь строится «черепашкой» без отрыва пера: каждая следующая спираль
 * начинается там, где закончилась предыдущая. Поэтому stroke-dashoffset
 * прорисовывает орнамент как одну линию, а не как набор отдельных копий.
 */

/** Радиусы витков от глаза спирали к её краю. */
const SPIRAL_RADII = [3, 6, 10, 16]

/** Угол одного витка в градусах. */
const SPIRAL_TURN = 110

/** Запас вокруг контура, чтобы скруглённые концы штриха не срезались. */
const PADDING = 3

type Walked = {
  commands: string
  minX: number
  maxX: number
  minY: number
  maxY: number
}

/** Один S-модуль: раскрутка из левого глаза и закрутка в правый. */
const S_MODULE: ReadonlyArray<readonly [number, number]> = [
  ...SPIRAL_RADII.map((radius) => [-SPIRAL_TURN, radius] as const),
  ...[...SPIRAL_RADII].reverse().map((radius) => [SPIRAL_TURN, radius] as const),
]

/** Проходит цепочку дуг [поворот в градусах, радиус], попутно считая габариты. */
function walk(segments: readonly (readonly [number, number])[]): Walked {
  let heading = 0
  let x = 0
  let y = 0

  const commands: string[] = []
  const xs = [0]
  const ys = [0]

  for (const [turnDeg, radius] of segments) {
    const turn = (turnDeg * Math.PI) / 180
    const side = Math.sign(turn)

    const centerX = x + radius * side * -Math.sin(heading)
    const centerY = y + radius * side * Math.cos(heading)

    const rotate = (angle: number) => {
      const cos = Math.cos(angle)
      const sin = Math.sin(angle)
      const vx = x - centerX
      const vy = y - centerY
      return [centerX + cos * vx - sin * vy, centerY + sin * vx + cos * vy] as const
    }

    const steps = Math.max(6, Math.ceil(Math.abs(turnDeg) / 12))
    for (let step = 1; step <= steps; step += 1) {
      const [px, py] = rotate((turn * step) / steps)
      xs.push(px)
      ys.push(py)
    }

    const [nextX, nextY] = rotate(turn)
    const largeArc = Math.abs(turn) > Math.PI ? 1 : 0
    const sweep = turn > 0 ? 1 : 0

    commands.push(
      `a ${radius} ${radius} 0 ${largeArc} ${sweep} ${(nextX - x).toFixed(2)} ${(nextY - y).toFixed(2)}`,
    )

    x = nextX
    y = nextY
    heading += turn
  }

  return {
    commands: commands.join(' '),
    minX: Math.min(...xs),
    maxX: Math.max(...xs),
    minY: Math.min(...ys),
    maxY: Math.max(...ys),
  }
}

export type OrnamentGeometry = {
  d: string
  width: number
  height: number
}

export function buildOrnamentPath(modules: number): OrnamentGeometry {
  const count = Math.max(1, modules)
  const segments: Array<readonly [number, number]> = []

  for (let i = 0; i < count; i += 1) {
    segments.push(...S_MODULE)
  }

  const walked = walk(segments)
  const startX = PADDING - walked.minX
  const startY = PADDING - walked.minY

  return {
    d: `M ${startX.toFixed(2)} ${startY.toFixed(2)} ${walked.commands}`,
    width: walked.maxX - walked.minX + PADDING * 2,
    height: walked.maxY - walked.minY + PADDING * 2,
  }
}
