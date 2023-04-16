using System;
using System.Drawing;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;
using System.Reflection;

namespace NetApp
{
    internal class MouseSimulator
    {
        [DllImport("user32.dll")]
        static extern bool SetCursorPos(int X, int Y);

        [DllImport("user32.dll")]
        static extern bool GetCursorPos(out Point lpPoint);

        public static void Move(int deltaX, int deltaY)
        {
            Point currentPosition;
            if (GetCursorPos(out currentPosition))
            {
                int newX = currentPosition.X + deltaX;
                int newY = currentPosition.Y + deltaY;
                SetCursorPos(newX, newY);
            }
        }
    }
}
