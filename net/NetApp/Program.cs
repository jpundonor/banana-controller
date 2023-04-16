using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using static NetApp.WindowsCrap;

namespace NetApp
{
    internal class Program
    {
        static async Task LeftClick()
        {
            // Envía la entrada de mouse para hacer clic izquierdo
            var input = new INPUT()
            {
                type = 0,

                U = new InputUnion()
                {
                    mi = new MOUSEINPUT()
                    {
                        dwFlags = MOUSEEVENTF.LEFTDOWN
                    }
                }
            };
            WindowsCrap.SendInput(1, new INPUT[] { input }, Marshal.SizeOf(input));

            // Espera un breve momento para simular el tiempo que el botón se mantiene presionado
            await Task.Delay(100);

            // Envía la entrada de mouse para liberar el clic izquierdo
            input.U.mi.dwFlags = MOUSEEVENTF.LEFTUP;
            WindowsCrap.SendInput(1, new INPUT[] { input }, Marshal.SizeOf(input));
        }

        static void Main(string[] args)
        {            
            Console.WriteLine("Iniciando programa de .NET");
            while (true)
            {
                //string movimiento = Console.ReadLine(); // 0, -1, 1
                string entrada = Console.ReadLine();
                string[] datos = entrada.Split(',');
                string movimientoIzq = datos[0];
                string movimientoDer = datos[1];
                string verticalIzq = datos[2];
                string verticalDer = datos[3];
                string acercarIzq = datos[4];
                string acercarDer = datos[5];
                string combinarPlat = datos[6];

                

                // MOVIMIENTO IZQUIERDO (grados)
                if (movimientoIzq.Equals("0"))
                {
                    // No te muevas
                    WindowsCrap.MouseMove(0, 0);
                }
                else if (movimientoIzq.Equals("1"))
                {
                    // Muevete a la der
                    WindowsCrap.MouseMove(50, 0);
                }
                else if (movimientoIzq.Equals("-1"))
                {
                    // Muevete a la izq
                    WindowsCrap.MouseMove(-50, 0);
                }
                

                // MOVIMIENTO DERECHO (grados)
                if (movimientoDer.Equals("0"))
                {
                    // No te muevas
                    WindowsCrap.Release(WindowsCrap.ScanCodeShort.KEY_A);
                    WindowsCrap.Release(WindowsCrap.ScanCodeShort.KEY_D);
                }
                else if (movimientoDer.Equals("1"))
                {
                    // Muevete a la der
                    WindowsCrap.Press(WindowsCrap.ScanCodeShort.KEY_D);
                    WindowsCrap.Release(WindowsCrap.ScanCodeShort.KEY_A);
                }
                else if (movimientoDer.Equals("-1"))
                {
                    // Muevete a la izq
                    WindowsCrap.Press(WindowsCrap.ScanCodeShort.KEY_A);
                    WindowsCrap.Release(WindowsCrap.ScanCodeShort.KEY_D);
                }


                // MOVIMIENTO VERTICAL IZQUIERDA
                if (verticalIzq.Equals("0"))
                {
                    WindowsCrap.MouseMove(0, 0);
                }
                else if (verticalIzq.Equals("1"))
                {
                    WindowsCrap.MouseMove(0, -50);
                }
                else if (verticalIzq.Equals("-1"))
                {
                    WindowsCrap.MouseMove(0, 50);
                }


                //MOVIMIENTO VERTICAL DERECHA

                if (verticalDer.Equals("0"))
                {
                    WindowsCrap.Release(WindowsCrap.ScanCodeShort.KEY_W);
                    WindowsCrap.Release(WindowsCrap.ScanCodeShort.KEY_S);
                }
                else if (verticalDer.Equals("1"))
                {
                    WindowsCrap.Press(WindowsCrap.ScanCodeShort.KEY_W);
                    WindowsCrap.Release(WindowsCrap.ScanCodeShort.KEY_S);
                }
                else if (verticalDer.Equals("-1"))
                {
                    WindowsCrap.Press(WindowsCrap.ScanCodeShort.KEY_S);
                    WindowsCrap.Release(WindowsCrap.ScanCodeShort.KEY_W);
                }


                // ACERCAR / ALEJAR IZQUIERDA
                if (acercarIzq.Equals("0"))
                {
                    // Adelante / acelerar
                    WindowsCrap.Release(WindowsCrap.ScanCodeShort.KEY_Q);
                    WindowsCrap.Release(WindowsCrap.ScanCodeShort.SPACE);
                }
                else if (acercarIzq.Equals("1"))
                {
                    WindowsCrap.Press(WindowsCrap.ScanCodeShort.KEY_Q);
                    WindowsCrap.Release(WindowsCrap.ScanCodeShort.SPACE);
                }
                else if (acercarIzq.Equals("-1"))
                {
                    WindowsCrap.Press(WindowsCrap.ScanCodeShort.SPACE);
                    WindowsCrap.Release(WindowsCrap.ScanCodeShort.KEY_Q);
                }

                // ACERCAR / ALEJAR DERECHA

                if (acercarDer.Equals("0"))
                {
                    WindowsCrap.Release(WindowsCrap.ScanCodeShort.KEY_R);
                    WindowsCrap.Release(WindowsCrap.ScanCodeShort.LBUTTON);
                }
                else if (acercarDer.Equals("1"))
                {
                    WindowsCrap.Press(WindowsCrap.ScanCodeShort.KEY_R);
                    WindowsCrap.Release(WindowsCrap.ScanCodeShort.LBUTTON);
                }
                else if (acercarDer.Equals("-1"))
                {
                    _ = LeftClick();
                    WindowsCrap.Press(WindowsCrap.ScanCodeShort.LBUTTON);
                    WindowsCrap.Release(WindowsCrap.ScanCodeShort.KEY_R);
                }

                ///*
                // COMBINAR AMBOS OBJETOS
                if (combinarPlat.Equals("1"))
                {
                    WindowsCrap.Press(WindowsCrap.ScanCodeShort.KEY_E);
                }
                else 
                {
                    WindowsCrap.Release(WindowsCrap.ScanCodeShort.KEY_E);
                }
                //*/


                /*

                // COMBINAR AMBOS OBJETOS
                if (combinarPlat.Equals("0"))
                {
                    WindowsCrap.Release(WindowsCrap.ScanCodeShort.SPACE);
                    WindowsCrap.Release(WindowsCrap.ScanCodeShort.KEY_E);
                }
                else if (acercarDer.Equals("1"))
                {
                    WindowsCrap.Hold(WindowsCrap.ScanCodeShort.SPACE);
                    WindowsCrap.Release(WindowsCrap.ScanCodeShort.KEY_E);
                }
                else if (acercarDer.Equals("-1"))
                {
                    WindowsCrap.Press(WindowsCrap.ScanCodeShort.KEY_E);
                    WindowsCrap.Release(WindowsCrap.ScanCodeShort.SPACE);
                }
                */
            }
        }
    }
}
